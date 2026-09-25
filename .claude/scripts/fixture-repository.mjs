// Builds a throwaway repository for the tests of `check-skill-publishability.mjs` and
// `plugin-manifests.mjs`. Both scripts are copied into a temporary directory beside a skills tree
// that passes every rule, so a test changes one file and runs the checker there as its own process,
// exactly as `make -f .claude/Makefile check-skills` runs it.
import assert from 'assert/strict';
import { spawnSync } from 'child_process';
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

/** The scripts copied into every fixture, the first being the entry point the checker runs from. */
const SCRIPTS = ['check-skill-publishability.mjs', 'plugin-manifests.mjs', 'file-system.mjs'];

/** The `metadata` value that marks a skill internal, nesting `internal: true` beneath the key. */
const INTERNAL_METADATA = '\n    internal: true';

/** Returns the frontmatter a fixture skill named `name` passes every rule with. */
function passingFields(name) {
	return { name, description: `${name} skill.`, license: 'MIT' };
}

/** Returns the marketplace entry offering the fixture skill named `name`. */
function entryFor(name) {
	return { name, source: `./.claude/skills/${name}`, description: `${name} plugin.` };
}

/** The frontmatter of `alpha`, the fixture's installable skill, for a case to override one key of. */
export const ALPHA_FIELDS = passingFields('alpha');

/** The frontmatter of `beta`, the fixture's internal skill. */
export const BETA_FIELDS = { ...passingFields('beta'), metadata: INTERNAL_METADATA };

/** The description `alpha` carries in both its manifest and its marketplace entry. */
export const ALPHA_DESCRIPTION = entryFor('alpha').description;

/** Repository-relative path of the SKILL.md for `alpha`. */
export const ALPHA_SKILL = '.claude/skills/alpha/SKILL.md';

/** Repository-relative path of `alpha`'s plugin manifest. */
export const ALPHA_MANIFEST = '.claude/skills/alpha/.claude-plugin/plugin.json';

/** Repository-relative path of `alpha`'s README, the page VS Code shows for the plugin. */
export const ALPHA_README = '.claude/skills/alpha/README.md';

/** Repository-relative path of the marketplace. */
export const MARKETPLACE = '.claude-plugin/marketplace.json';

/**
 * A fixture repository and what a test does with it.
 *
 * @typedef {object} FixtureRepository
 * @property {string} root Absolute path of the temporary directory holding the repository.
 * @property {(path: string, contents: string | object) => void} write Writes `contents` to the
 *     repository-relative `path`, creating its directory. Anything but a string is written as JSON.
 * @property {(name: string, fields?: Record<string, string | undefined>) => void} addOfferedSkill
 *     Adds a skill that passes every rule an offered skill meets, with a licence, a README, a plugin
 *     manifest, and a marketplace entry, and with `fields` overriding its frontmatter.
 * @property {(name: string, fields?: Record<string, string | undefined>) => void} addInternalSkill
 *     Adds an internal skill with a licence, and with `fields` overriding its frontmatter.
 * @property {() => { status: number | null, output: string }} check Runs the checker and returns its
 *     exit status and everything it printed.
 * @property {(...messages: string[]) => string} assertFailsOnce Runs the checker once and asserts
 *     that it exits 1, prints each of `messages` exactly once, and reports no other problem. Returns
 *     everything it printed.
 * @property {() => void} remove Deletes the repository.
 */

/**
 * Returns the text of a SKILL.md whose frontmatter holds one `key: value` line per entry of `fields`
 * that is not `undefined`, in order, followed by `body`.
 *
 * @param {Record<string, string | undefined>} fields Frontmatter keys and their values, written as given.
 * @param {string} [body] The Markdown beneath the frontmatter.
 * @returns {string} The file's contents.
 */
export function skillFile(fields, body = '# Skill\n') {
	const lines = Object.entries(fields)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}: ${value}`);

	return `---\n${lines.join('\n')}\n---\n\n${body}`;
}

/**
 * Returns the marketplace the fixture starts from, with any top-level keys in `overrides` applied.
 *
 * @param {Record<string, unknown>} [overrides] Top-level keys replacing the fixture's own.
 * @returns {Record<string, unknown>} The marketplace object.
 */
export function marketplace(overrides = {}) {
	return { name: 'fixture', owner: { name: 'Fixture' }, plugins: [entryFor('alpha')], ...overrides };
}

/** Writes `contents` to `path` under `root`, creating its directory, and anything but a string as JSON. */
function writeFile(root, path, contents) {
	mkdirSync(dirname(join(root, path)), { recursive: true });
	writeFileSync(join(root, path), typeof contents === 'string' ? contents : JSON.stringify(contents));
}

/** Runs the checker copied into `root` and returns its exit status and everything it printed. */
function runChecker(root) {
	const result = spawnSync(process.execPath, [join(root, '.claude/scripts', SCRIPTS[0])], { encoding: 'utf8' });

	return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

/**
 * Runs the checker in `root` and asserts that it exits 1, prints each of `messages` exactly once,
 * and reports as many problems as there are messages.
 *
 * @param {string} root Absolute path of the fixture repository.
 * @param {string[]} messages Text each expected failure contains.
 * @returns {string} Everything the checker printed.
 */
function assertFailsOnceIn(root, messages) {
	const { status, output } = runChecker(root);

	assert.equal(status, 1, output);
	assert.ok(
		output.includes(`\n${messages.length} problem(s).`),
		`expected ${messages.length} problem(s) in:\n${output}`,
	);

	for (const message of messages) {
		const occurrences = output.split(message).length - 1;

		assert.equal(occurrences, 1, `expected "${message}" exactly once in:\n${output}`);
	}

	return output;
}

/**
 * Creates a repository holding one offered skill, `alpha`, which also bundles one agent, and one
 * internal skill, `beta`, plus a marketplace listing `alpha`. It holds no prompt files, and the
 * checker passes it as created.
 *
 * @returns {FixtureRepository} The repository and the operations on it.
 */
export function createFixtureRepository() {
	const root = mkdtempSync(join(tmpdir(), 'check-skills-'));
	const offered = [];
	const write = (path, contents) => writeFile(root, path, contents);

	const addOfferedSkill = (name, fields = {}) => {
		const entry = entryFor(name);

		write(`.claude/skills/${name}/SKILL.md`, skillFile({ ...passingFields(name), ...fields }));
		write(`.claude/skills/${name}/LICENSE.txt`, 'MIT');
		write(`.claude/skills/${name}/README.md`, `# ${name}\n`);
		write(`.claude/skills/${name}/.claude-plugin/plugin.json`, { name, description: entry.description });
		offered.push(entry);
		write(MARKETPLACE, marketplace({ plugins: offered }));
	};

	const addInternalSkill = (name, fields = {}) => {
		write(
			`.claude/skills/${name}/SKILL.md`,
			skillFile({ ...passingFields(name), metadata: INTERNAL_METADATA, ...fields }),
		);
		write(`.claude/skills/${name}/LICENSE.txt`, 'MIT');
	};

	mkdirSync(join(root, '.claude/scripts'), { recursive: true });

	for (const script of SCRIPTS) {
		copyFileSync(join(import.meta.dirname, script), join(root, '.claude/scripts', script));
	}

	addOfferedSkill('alpha');
	write('.claude/skills/alpha/agents/helper.md', '# Helper\n');
	addInternalSkill('beta');

	return {
		root,
		write,
		addOfferedSkill,
		addInternalSkill,
		check: () => runChecker(root),
		assertFailsOnce: (...messages) => assertFailsOnceIn(root, messages),
		remove: () => rmSync(root, { recursive: true, force: true }),
	};
}
