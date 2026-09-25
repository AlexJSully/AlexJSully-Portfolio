// Tests for the plugin rules in `plugin-manifests.mjs`, run through the checker that reports them
// against a fixture repository from `fixture-repository.mjs`. Run with
// `make -f .claude/Makefile test-scripts`.
import assert from 'assert/strict';
import { renameSync, symlinkSync, unlinkSync } from 'fs';
// `node:test` has no unprefixed name, unlike the other built-in modules imported here.
import { afterEach, beforeEach, describe, it } from 'node:test';
import { join } from 'path';
import {
	ALPHA_DESCRIPTION,
	ALPHA_MANIFEST,
	ALPHA_README,
	MARKETPLACE,
	createFixtureRepository,
	marketplace,
} from './fixture-repository.mjs';

let fixture;

beforeEach(() => {
	fixture = createFixtureRepository();
});

afterEach(() => fixture.remove());

describe('plugin manifest checks', () => {
	it('passes a skill whose manifest and marketplace entry agree', () => {
		const { status, output } = fixture.check();

		assert.equal(status, 0, output);
		assert.match(output, /ok {3}\.claude-plugin\/marketplace\.json/);
	});

	for (const { label, manifest, message } of [
		{ label: 'a version', manifest: { version: '1.0.0' }, message: 'sets a version' },
		{ label: 'a name unlike its directory', manifest: { name: 'other' }, message: 'does not match the directory' },
		{ label: 'a non-string agents entry', manifest: { agents: [7] }, message: 'declares agent 7;' },
		{
			label: 'an agents path without "./"',
			manifest: { agents: 'agents/helper.md' },
			message: 'starting with "./"',
		},
		{
			label: 'an agents path leaving the skill',
			manifest: { agents: './../beta/SKILL.md' },
			message: 'outside the skill',
		},
		{
			label: 'an agents path that does not exist',
			manifest: { agents: './agents/gone.md' },
			message: 'does not exist',
		},
	]) {
		it(`reports a manifest carrying ${label}`, () => {
			fixture.write(ALPHA_MANIFEST, { name: 'alpha', description: ALPHA_DESCRIPTION, ...manifest });

			fixture.assertFailsOnce(message);
		});
	}

	it('reports an agents path whose symbolic link leads out of the skill', () => {
		symlinkSync(
			join(fixture.root, '.claude/skills/beta'),
			join(fixture.root, '.claude/skills/alpha/agents/escape'),
		);
		fixture.write(ALPHA_MANIFEST, { name: 'alpha', description: ALPHA_DESCRIPTION, agents: './agents/escape' });

		fixture.assertFailsOnce('outside the skill');
	});

	it('accepts an agents path pointing at a directory inside the skill', () => {
		fixture.write(ALPHA_MANIFEST, { name: 'alpha', description: ALPHA_DESCRIPTION, agents: './agents' });

		assert.equal(fixture.check().status, 0);
	});

	for (const competing of ['plugin.json', '.plugin/plugin.json', '.github/plugin/plugin.json']) {
		it(`reports a second manifest at ${competing}, which a host reads first`, () => {
			fixture.write(`.claude/skills/alpha/${competing}`, { name: 'alpha' });

			fixture.assertFailsOnce('a host reads this ahead of');
		});
	}

	for (const { label, contents, message } of [
		{ label: 'does not parse', contents: '{', message: 'does not parse as JSON' },
		{ label: 'is not an object', contents: 'null', message: 'is not a JSON object' },
	]) {
		it(`reports a manifest that ${label}, and goes on to check the marketplace`, () => {
			fixture.write(ALPHA_MANIFEST, contents);
			fixture.write(MARKETPLACE, marketplace({ metadata: { pluginRoot: './plugins' } }));

			fixture.assertFailsOnce(message, 'sets `metadata.pluginRoot`');
		});
	}
});

describe('plugin marketplace checks', () => {
	for (const { label, overrides, message } of [
		{ label: 'no name', overrides: { name: undefined }, message: 'needs a `name` and an `owner.name`' },
		{ label: 'no owner', overrides: { owner: undefined }, message: 'needs a `name` and an `owner.name`' },
		{
			label: 'a plugin root',
			overrides: { metadata: { pluginRoot: './plugins' } },
			message: 'sets `metadata.pluginRoot`',
		},
		{ label: 'no plugins array', overrides: { plugins: undefined }, message: 'has no `plugins` array' },
		{ label: 'no entry for an offered skill', overrides: { plugins: [] }, message: 'does not list "alpha"' },
	]) {
		it(`reports a marketplace with ${label}`, () => {
			fixture.write(MARKETPLACE, marketplace(overrides));

			fixture.assertFailsOnce(message);
		});
	}

	for (const { label, entry, message } of [
		{
			label: 'the wrong source',
			entry: { source: './alpha' },
			message: 'must have source "./.claude/skills/alpha"',
		},
		{ label: 'a key hosts read differently', entry: { strict: false }, message: 'sets `strict`' },
		{ label: 'no description', entry: { description: undefined }, message: 'has no description' },
		{
			label: 'a description unlike its manifest',
			entry: { description: 'Other.' },
			message: 'description differs',
		},
	]) {
		it(`reports an entry with ${label}`, () => {
			const alpha = { name: 'alpha', source: './.claude/skills/alpha', description: ALPHA_DESCRIPTION, ...entry };

			fixture.write(MARKETPLACE, marketplace({ plugins: [alpha] }));

			fixture.assertFailsOnce(message);
		});
	}

	it('reports an entry for an internal skill', () => {
		const beta = { name: 'beta', source: './.claude/skills/beta', description: 'Beta plugin.' };

		fixture.write(MARKETPLACE, marketplace({ plugins: [...marketplace().plugins, beta] }));

		fixture.assertFailsOnce('lists "beta", which is not a skill an installer may offer');
	});

	it('reports a repeated entry once, and its other failures once', () => {
		const wrong = { name: 'alpha', source: './alpha', description: ALPHA_DESCRIPTION };

		fixture.write(MARKETPLACE, marketplace({ plugins: [wrong, wrong] }));

		fixture.assertFailsOnce('lists "alpha" more than once', 'must have source');
	});

	it('reports a listed skill with no README.md', () => {
		unlinkSync(join(fixture.root, ALPHA_README));

		fixture.assertFailsOnce('has no README.md');
	});

	// Only a case-insensitive file system, such as macOS's default, tells this case apart from an
	// `existsSync` check; on a case-sensitive one both approaches report the renamed file.
	it('reports a README whose name differs from README.md only in case', () => {
		renameSync(join(fixture.root, ALPHA_README), join(fixture.root, '.claude/skills/alpha/readme.md'));

		fixture.assertFailsOnce('has no README.md');
	});

	it('reports a listed skill that has no manifest to compare against', () => {
		unlinkSync(join(fixture.root, ALPHA_MANIFEST));

		fixture.assertFailsOnce('has no .claude-plugin/plugin.json');
	});

	for (const shadowing of ['marketplace.json', '.plugin/marketplace.json', '.github/plugin/marketplace.json']) {
		it(`reports a marketplace file at ${shadowing}, which hosts read first, and prints no ok line`, () => {
			fixture.write(shadowing, { plugins: [] });

			const output = fixture.assertFailsOnce('so it hides that catalogue');

			assert.doesNotMatch(output, /ok {3}\.claude-plugin\/marketplace\.json/);
		});
	}

	it('reports a missing marketplace', () => {
		unlinkSync(join(fixture.root, MARKETPLACE));

		fixture.assertFailsOnce('missing, so no skill is installable');
	});
});
