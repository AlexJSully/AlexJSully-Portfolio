// Tests for the plugin rules in `plugin-manifests.mjs`, run through the checker that reports them.
//
// Each case builds a small repository in a temporary directory, copies both scripts into it, and
// runs the checker there as its own process, so the rules are exercised against real files exactly
// as `make -f .claude/Makefile check-skills` runs them. Run with `make -f .claude/Makefile test-scripts`.
import assert from 'assert/strict';
import { spawnSync } from 'child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, unlinkSync, writeFileSync } from 'fs';
// `node:test` has no unprefixed name, unlike the other built-in modules imported here.
import { afterEach, beforeEach, describe, it } from 'node:test';
import { tmpdir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ALPHA_DESCRIPTION = 'Alpha plugin.';
const ALPHA_MANIFEST = '.claude/skills/alpha/.claude-plugin/plugin.json';
const MARKETPLACE = '.claude-plugin/marketplace.json';

let root;

/** Writes `contents` to `path` under the fixture repository, creating its directory. */
function write(path, contents) {
	mkdirSync(dirname(join(root, path)), { recursive: true });
	writeFileSync(join(root, path), typeof contents === 'string' ? contents : JSON.stringify(contents));
}

/**
 * Builds a repository holding one installable skill, `alpha`, with a manifest and one agent, and
 * one internal skill, `beta`, with neither, plus a marketplace listing `alpha` alone.
 */
function buildRepository() {
	root = mkdtempSync(join(tmpdir(), 'plugin-manifests-'));

	for (const script of ['check-skill-publishability.mjs', 'plugin-manifests.mjs']) {
		mkdirSync(join(root, '.claude/scripts'), { recursive: true });
		copyFileSync(join(SCRIPT_DIR, script), join(root, '.claude/scripts', script));
	}

	write(
		'.claude/skills/alpha/SKILL.md',
		'---\nname: alpha\ndescription: Alpha skill.\nlicense: MIT\n---\n\n# Alpha\n',
	);
	write('.claude/skills/alpha/LICENSE.txt', 'MIT');
	write('.claude/skills/alpha/agents/helper.md', '# Helper\n');
	write(ALPHA_MANIFEST, { name: 'alpha', description: ALPHA_DESCRIPTION });
	write(
		'.claude/skills/beta/SKILL.md',
		'---\nname: beta\ndescription: Beta skill.\nlicense: MIT\nmetadata:\n    internal: true\n---\n\n# Beta\n',
	);
	write('.claude/skills/beta/LICENSE.txt', 'MIT');
	write(MARKETPLACE, marketplace());
}

/** The marketplace the fixture starts from, with any top-level keys in `overrides` applied. */
function marketplace(overrides = {}) {
	return {
		name: 'fixture',
		owner: { name: 'Fixture' },
		plugins: [{ name: 'alpha', source: './.claude/skills/alpha', description: ALPHA_DESCRIPTION }],
		...overrides,
	};
}

/** Runs the checker against the fixture and returns its exit status and everything it printed. */
function check() {
	const result = spawnSync(process.execPath, [join(root, '.claude/scripts/check-skill-publishability.mjs')], {
		encoding: 'utf8',
	});

	return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

/** Asserts that the checker exits 1 and prints a failure containing `message` exactly once. */
function assertFailsOnce(message) {
	const { status, output } = check();

	assert.equal(status, 1, output);
	assert.equal(output.split(message).length - 1, 1, output);
}

beforeEach(buildRepository);

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('plugin manifest checks', () => {
	it('passes a skill whose manifest and marketplace entry agree', () => {
		const { status, output } = check();

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
			write(ALPHA_MANIFEST, { name: 'alpha', description: ALPHA_DESCRIPTION, ...manifest });

			assertFailsOnce(message);
		});
	}

	it('accepts an agents path pointing at a directory inside the skill', () => {
		write(ALPHA_MANIFEST, { name: 'alpha', description: ALPHA_DESCRIPTION, agents: './agents' });

		assert.equal(check().status, 0);
	});

	it('reports a second manifest that a host reads first', () => {
		write('.claude/skills/alpha/plugin.json', { name: 'alpha' });

		assertFailsOnce('a host reads this ahead of');
	});

	for (const { label, contents, message } of [
		{ label: 'does not parse', contents: '{', message: 'does not parse as JSON' },
		{ label: 'is not an object', contents: 'null', message: 'is not a JSON object' },
	]) {
		it(`reports a manifest that ${label} without stopping the run`, () => {
			write(ALPHA_MANIFEST, contents);

			assertFailsOnce(message);
		});
	}
});

describe('plugin marketplace checks', () => {
	for (const { label, overrides, message } of [
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
			write(MARKETPLACE, marketplace(overrides));

			assertFailsOnce(message);
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

			write(MARKETPLACE, marketplace({ plugins: [alpha] }));

			assertFailsOnce(message);
		});
	}

	it('reports an entry for an internal skill', () => {
		const beta = { name: 'beta', source: './.claude/skills/beta', description: 'Beta plugin.' };

		write(MARKETPLACE, marketplace({ plugins: [...marketplace().plugins, beta] }));

		assertFailsOnce('lists "beta", which is not a skill an installer may offer');
	});

	it('reports a repeated entry once, and its other failures once', () => {
		const wrong = { name: 'alpha', source: './alpha', description: ALPHA_DESCRIPTION };

		write(MARKETPLACE, marketplace({ plugins: [wrong, wrong] }));

		assertFailsOnce('lists "alpha" more than once');
		assertFailsOnce('must have source');
	});

	it('reports a listed skill that has no manifest to compare against', () => {
		unlinkSync(join(root, ALPHA_MANIFEST));

		assertFailsOnce('has no .claude-plugin/plugin.json');
	});

	it('reports a marketplace file that hosts read before this one', () => {
		write('.github/plugin/marketplace.json', { plugins: [] });

		assertFailsOnce('so it hides that catalogue');
	});

	it('reports a missing marketplace', () => {
		unlinkSync(join(root, MARKETPLACE));

		assertFailsOnce('missing, so no skill is installable');
	});
});
