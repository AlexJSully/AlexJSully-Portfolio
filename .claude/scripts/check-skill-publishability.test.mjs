// Tests for the skill and prompt rules in `check-skill-publishability.mjs`, run against a fixture
// repository from `fixture-repository.mjs`. Run with `make -f .claude/Makefile test-scripts`.
import assert from 'assert/strict';
import { mkdirSync, symlinkSync, unlinkSync, writeFileSync } from 'fs';
// `node:test` has no unprefixed name, unlike the other built-in modules imported here.
import { afterEach, beforeEach, describe, it } from 'node:test';
import { join } from 'path';
import {
	ALPHA_FIELDS,
	ALPHA_MANIFEST,
	ALPHA_README,
	ALPHA_SKILL,
	BETA_FIELDS,
	MARKETPLACE,
	createFixtureRepository,
	marketplace,
	skillFile,
} from './fixture-repository.mjs';

/** Returns the text of a prompt file with valid frontmatter and `body` beneath it. */
function promptFile(body) {
	return `---\ndescription: Alpha prompt.\n---\n\n${body}`;
}

/** Returns the text of a prompt file exactly `length` characters long. */
function promptOfLength(length) {
	return promptFile('x'.repeat(length - promptFile('').length));
}

let fixture;

beforeEach(() => {
	fixture = createFixtureRepository();
});

afterEach(() => fixture.remove());

describe('skill checks', () => {
	it('passes the fixture and totals its skills by state', () => {
		const { status, output } = fixture.check();

		assert.equal(status, 0, output);
		assert.match(output, /ok {3}alpha +installable/);
		assert.match(output, /ok {3}beta +internal/);
		assert.match(output, /Checked 2 skill\(s\) and 0 prompt\(s\): 0 published, 1 installable, 1 internal\./);
	});

	it('reports a skill named in the published list as published', () => {
		fixture.addOfferedSkill('audit-pr');

		const { status, output } = fixture.check();

		assert.equal(status, 0, output);
		assert.match(output, /ok {3}audit-pr +published/);
		assert.match(output, /1 published, 1 installable, 1 internal\./);
	});

	for (const { label, contents, message } of [
		{ label: 'no frontmatter block', contents: '# Alpha\n', message: 'no frontmatter block' },
		{
			label: 'a name unlike its directory',
			contents: skillFile({ ...ALPHA_FIELDS, name: 'other' }),
			message: 'does not match the directory name "alpha"',
		},
		{
			label: 'no description',
			contents: skillFile({ ...ALPHA_FIELDS, description: undefined }),
			message: 'no description, which is how',
		},
		{
			label: 'a description of 1025 characters',
			contents: skillFile({ ...ALPHA_FIELDS, description: 'x'.repeat(1025) }),
			message: 'over the 1024 allowed',
		},
		{
			label: 'an unquoted description containing ": "',
			contents: skillFile({ ...ALPHA_FIELDS, description: 'Audit: everything' }),
			message: '`description` is an unquoted scalar',
		},
		{
			label: 'no license key',
			contents: skillFile({ ...ALPHA_FIELDS, license: undefined }),
			message: 'so it needs a license key',
		},
		{
			// The blank line after the frontmatter is the body's first line, so this body has 501.
			label: 'a body of 501 lines',
			contents: skillFile(ALPHA_FIELDS, 'line\n'.repeat(500)),
			message: 'body is 501 lines',
		},
		{
			label: 'a link to a bundled file that does not exist',
			contents: skillFile(ALPHA_FIELDS, '[guide](references/gone.md)\n'),
			message: 'references "references/gone.md"',
		},
		{
			label: 'a link with a fragment to a bundled file that does not exist',
			contents: skillFile(ALPHA_FIELDS, '[guide](references/gone.md#part)\n'),
			message: 'references "references/gone.md"',
		},
		{
			label: 'a code span naming a bundled file that does not exist',
			contents: skillFile(ALPHA_FIELDS, 'Open `references/gone.md`.\n'),
			message: 'references "references/gone.md"',
		},
		{
			label: 'a link climbing out of the skill to a file that exists',
			contents: skillFile(ALPHA_FIELDS, '[beta](agents/../../beta/SKILL.md)\n'),
			message: 'references "agents/../../beta/SKILL.md", which resolves outside the skill directory',
		},
		{
			label: 'a code span climbing out of the skill to a file that exists',
			contents: skillFile(ALPHA_FIELDS, 'Compare `agents/../../beta/SKILL.md`.\n'),
			message: 'references "agents/../../beta/SKILL.md", which resolves outside the skill directory',
		},
	]) {
		it(`reports a SKILL.md with ${label}`, () => {
			fixture.write(ALPHA_SKILL, contents);

			fixture.assertFailsOnce(message);
		});
	}

	for (const { label, contents } of [
		{
			label: 'a quoted description containing ": "',
			contents: skillFile({ ...ALPHA_FIELDS, description: '"Audit: everything"' }),
		},
		{
			label: 'a description of exactly 1024 characters',
			contents: skillFile({ ...ALPHA_FIELDS, description: 'x'.repeat(1024) }),
		},
		{
			// The blank line after the frontmatter is the body's first line, so this body has 500.
			label: 'a body of exactly 500 lines',
			contents: skillFile(ALPHA_FIELDS, 'line\n'.repeat(499)),
		},
		{
			label: 'a link and a code span naming a bundled file that exists',
			contents: skillFile(ALPHA_FIELDS, '[helper](agents/helper.md) and `agents/helper.md`\n'),
		},
		{
			label: '`user-invocable: false` on a skill that is not published',
			contents: skillFile({ ...ALPHA_FIELDS, 'user-invocable': 'false' }),
		},
	]) {
		it(`accepts a SKILL.md with ${label}`, () => {
			fixture.write(ALPHA_SKILL, contents);

			const { status, output } = fixture.check();

			assert.equal(status, 0, output);
		});
	}

	for (const { label, name, message } of [
		{ label: 'characters outside the allowed set', name: 'Bad_Name', message: 'must be lowercase alphanumeric' },
		{ label: '65 characters', name: 'a'.repeat(65), message: 'over the 64 the specification allows' },
	]) {
		it(`reports a skill name with ${label}`, () => {
			fixture.addInternalSkill(name);

			fixture.assertFailsOnce(message);
		});
	}

	it('accepts a skill name of exactly 64 characters', () => {
		fixture.addInternalSkill('a'.repeat(64));

		assert.equal(fixture.check().status, 0);
	});

	it('reports a link to a bundled symbolic link that leads out of the skill', () => {
		fixture.write('shared/guide.md', '# Guide\n');
		symlinkSync(join(fixture.root, 'shared/guide.md'), join(fixture.root, '.claude/skills/alpha/agents/guide.md'));
		fixture.write(ALPHA_SKILL, skillFile(ALPHA_FIELDS, '[guide](agents/guide.md)\n'));

		fixture.assertFailsOnce('references "agents/guide.md", which resolves outside the skill directory');
	});

	it('checks a skill directory reached through a symbolic link', () => {
		fixture.write('shared/gamma/SKILL.md', skillFile({ ...BETA_FIELDS, name: 'gamma' }));
		fixture.write('shared/gamma/LICENSE.txt', 'MIT');
		symlinkSync(join(fixture.root, 'shared/gamma'), join(fixture.root, '.claude/skills/gamma'));

		const { status, output } = fixture.check();

		assert.equal(status, 0, output);
		assert.match(output, /ok {3}gamma +internal/);
	});

	it('reports a skill directory whose SKILL.md is a directory', () => {
		mkdirSync(join(fixture.root, '.claude/skills/empty/SKILL.md'), { recursive: true });

		fixture.assertFailsOnce('.claude/skills/empty/SKILL.md: no SKILL.md');
	});

	it('reports a skill whose LICENSE.txt is a directory', () => {
		const licence = join(fixture.root, '.claude/skills/alpha/LICENSE.txt');

		unlinkSync(licence);
		mkdirSync(licence);

		fixture.assertFailsOnce('so it needs a LICENSE.txt beside it');
	});

	it('reports a skill directory with no SKILL.md', () => {
		fixture.write('.claude/skills/empty/notes.txt', 'notes');

		fixture.assertFailsOnce('.claude/skills/empty/SKILL.md: no SKILL.md');
	});

	it('reports a skill with no LICENSE.txt, and prints no ok line for it', () => {
		unlinkSync(join(fixture.root, '.claude/skills/alpha/LICENSE.txt'));

		const output = fixture.assertFailsOnce('so it needs a LICENSE.txt beside it');

		assert.doesNotMatch(output, /ok {3}alpha /);
	});

	for (const { label, path, contents, message } of [
		{
			label: 'its README naming a prompt file',
			path: ALPHA_README,
			contents: '# alpha\n\nPairs with `alpha.prompt.md`.\n',
			message: 'README.md: names a prompt file',
		},
		{
			label: 'its README naming the prompts directory',
			path: ALPHA_README,
			contents: '# alpha\n\nSee .github/prompts/ for the other half.\n',
			message: 'README.md: names a prompt file',
		},
		{
			label: 'a bundled agent naming a prompt file',
			path: '.claude/skills/alpha/agents/helper.md',
			contents: '# Helper\n\nSee `alpha.prompt.md`.\n',
			message: 'agents/helper.md: names a prompt file',
		},
	]) {
		it(`reports a skill that is not internal with ${label}`, () => {
			fixture.write(path, contents);

			fixture.assertFailsOnce(message);
		});
	}

	it('reports a plugin manifest whose description names a prompt file', () => {
		const description = 'Pairs with alpha.prompt.md.';
		const entry = { name: 'alpha', source: './.claude/skills/alpha', description };

		fixture.write(ALPHA_MANIFEST, { name: 'alpha', description });
		fixture.write(MARKETPLACE, marketplace({ plugins: [entry] }));

		fixture.assertFailsOnce('.claude-plugin/plugin.json: names a prompt file');
	});

	it('lets an internal skill name a prompt file', () => {
		const beta = skillFile(BETA_FIELDS, 'Edit `.github/prompts/beta.prompt.md` alongside this file.\n');

		fixture.write('.claude/skills/beta/SKILL.md', beta);

		assert.equal(fixture.check().status, 0);
	});

	it('reports a bundled symbolic link whose target names a prompt file', () => {
		fixture.write('shared/linked.md', 'See `alpha.prompt.md`.\n');
		symlinkSync(
			join(fixture.root, 'shared/linked.md'),
			join(fixture.root, '.claude/skills/alpha/agents/linked.md'),
		);

		fixture.assertFailsOnce('agents/linked.md: names a prompt file');
	});

	for (const { label, create } of [
		{
			label: 'a directory named like Markdown at the top of a skill',
			create: (at) => mkdirSync(at('.claude/skills/alpha/notes.md')),
		},
		{
			label: 'a symbolic link to nothing at the top of a skill',
			create: (at) => symlinkSync(at('gone.md'), at('.claude/skills/alpha/notes.md')),
		},
		{
			label: 'a file where a bundle directory belongs',
			create: (at) => writeFileSync(at('.claude/skills/alpha/assets'), 'x'),
		},
		{
			label: 'a directory named like a prompt file',
			create: (at) => mkdirSync(at('.github/prompts/alpha.prompt.md'), { recursive: true }),
		},
	]) {
		it(`skips ${label}`, () => {
			create((path) => join(fixture.root, path));

			const { status, output } = fixture.check();

			assert.equal(status, 0, output);
		});
	}

	it('skips a directory nested in a bundle directory', () => {
		fixture.write('.claude/skills/alpha/references/nested/deep.md', '# Deep\n');

		const { status, output } = fixture.check();

		assert.equal(status, 0, output);
	});

	for (const { label, fields, message } of [
		{ label: '`user-invocable: false`', fields: { 'user-invocable': 'false' }, message: 'user-invocable: false' },
		{ label: '`user-invocable: no`', fields: { 'user-invocable': 'no' }, message: 'user-invocable: false' },
		{ label: '`user-invocable: False`', fields: { 'user-invocable': 'False' }, message: 'user-invocable: false' },
		{ label: '`paths:`', fields: { paths: "['src/**']" }, message: 'may not carry `paths:`' },
	]) {
		it(`reports a published skill carrying ${label}`, () => {
			fixture.addOfferedSkill('audit-pr', fields);

			fixture.assertFailsOnce(message);
		});
	}
});

describe('prompt checks', () => {
	it('passes a prompt whose links are an illustration and an in-page anchor', () => {
		fixture.write(
			'.github/prompts/alpha.prompt.md',
			promptFile('Cite as [config](../src/config.py). See [rules](#rules).\n'),
		);

		const { status, output } = fixture.check();

		assert.equal(status, 0, output);
		assert.match(output, /and 1 prompt\(s\)/);
	});

	for (const { file, budget } of [
		{ file: 'alpha.prompt.md', budget: 52_000 },
		{ file: 'audit-docs.prompt.md', budget: 36_000 },
	]) {
		it(`accepts ${file} at exactly its budget of ${budget} characters`, () => {
			fixture.write(`.github/prompts/${file}`, promptOfLength(budget));

			assert.equal(fixture.check().status, 0);
		});

		it(`reports ${file} one character over its budget of ${budget}`, () => {
			fixture.write(`.github/prompts/${file}`, promptOfLength(budget + 1));

			fixture.assertFailsOnce(`budget of ${budget}`);
		});
	}

	for (const { label, contents, message } of [
		{
			label: 'with a link to a real file',
			contents: promptFile('[catalogue](../../.claude-plugin/marketplace.json)\n'),
			message: 'a real file that will not travel',
		},
		{
			label: 'naming a bundle directory',
			contents: promptFile('Open `references/guide.md`.\n'),
			message: 'names "references/"',
		},
		{
			label: 'naming the skill half',
			contents: promptFile('Read SKILL.md first.\n'),
			message: 'names the skill half',
		},
		{ label: 'with no frontmatter block', contents: '# Alpha\n', message: 'alpha.prompt.md: no frontmatter block' },
	]) {
		it(`reports a prompt ${label}`, () => {
			fixture.write('.github/prompts/alpha.prompt.md', contents);

			fixture.assertFailsOnce(message);
		});
	}
});
