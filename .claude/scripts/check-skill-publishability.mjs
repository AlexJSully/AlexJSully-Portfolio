#!/usr/bin/env node
// Checks that every skill under `.claude/skills/` is valid against the Agent Skills
// specification, and that each half of a published pair still works when it is the only
// thing someone has.
//
// The two halves of a pair carry the same objective, not the same bytes: a skill may bundle
// `references/`, `agents/`, and `assets/` that a single prompt file cannot. Whether they still
// aim at the same outcome is a judgement, so it belongs to the `prompt-skill-sync` subagent.
// What is left here is what a machine can decide.
//
// Run with no arguments. Reports every failure, then exits 1 if there were any.
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PROMPT_DIR = join(REPO_ROOT, '.github', 'prompts');
const SKILL_DIR = join(REPO_ROOT, '.claude', 'skills');

/**
 * Skills published for use outside this repository. Only these are held to the agnosticism
 * bar, because a skill written for this repository alone may name this repository's paths.
 *
 * Every other skill is either `installable`, meaning an installer offers it without holding it
 * to that bar, or `internal`, meaning `metadata.internal: true` keeps it out of `npx skills`
 * discovery. Naming the middle state is the point: a skill that is nothing in particular drifts
 * into being offered to strangers with nobody having decided that it should be.
 *
 * The licence rules below apply to all three, because `gh skill` reads no visibility field and
 * offers an internal skill as readily as a published one.
 */
const PUBLISHED = ['audit-docs', 'audit-pr', 'typescript-code-and-test-standards'];

/** The spec caps the body at 500 lines; longer belongs in `references/`. */
const MAX_BODY_LINES = 500;

/** The spec caps `description` at 1024 characters, because it loads at startup. */
const MAX_DESCRIPTION = 1024;

/**
 * A prompt is one file a reader scrolls in a chat pane, with no `references/` to move detail into,
 * so its budget is the whole of what it can say. `audit-docs` is held tighter than the other two
 * because its subject is narrower. Growth past a budget is a signal to condense, not to raise it:
 * restatements of one rule across sections, and worked examples following the rule they
 * illustrate, are what a prompt loses first, and never a rule, a checklist item, or a category.
 *
 * The budget counts characters because a line here is a paragraph. Markdown lint rule `MD013` is
 * off repository-wide and Prettier leaves prose unwrapped, so one line in these files runs to
 * seventeen hundred characters. Counting lines charges a document for its blank lines and its
 * headings, and lets it pay by deleting them: the same eighteen sections cost 36 lines as `###`
 * headings and nothing at all inline, while the text is identical either way. Characters do not
 * move when a document is reformatted, so only cutting what a prompt says brings the number down.
 *
 * `wc -c` is the hand-check. It counts bytes where this counts UTF-16 code units, so it reads a
 * dozen or so high on a file carrying emoji, which is far inside the headroom each budget leaves.
 */
const MAX_PROMPT_CHARS = 52_000;
const MAX_PROMPT_CHARS_BY_FILE = { 'audit-docs.prompt.md': 36_000 };

/**
 * Directories a skill may bundle. The specification defines `references/`, `assets/`, and
 * `scripts/`; `agents/` is a host extension, read only where a plugin manifest turns the
 * directory into a plugin, and inert everywhere else.
 */
const BUNDLE_DIRS = ['references', 'agents', 'assets', 'scripts'];

/**
 * The manifest that makes a skill directory load as a plugin, so the files in `agents/` register
 * as agents a run can delegate to instead of sitting there as unread text.
 *
 * It is optional, and a skill without one is not at fault: every bundled procedure is written to
 * be followed by opening its file, which needs no manifest and no host support. What this path
 * is checked for is the failure that hides, namely a manifest whose name disagrees with the
 * directory, which registers the plugin under a name nothing refers to.
 */
const PLUGIN_MANIFEST = join('.claude-plugin', 'plugin.json');

const failures = [];

/** Records one failure against a file. */
function fail(file, message) {
	failures.push({ file, message });
}

/** Splits a Markdown file into its frontmatter block and the body beneath it. */
function split(text) {
	const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(text);

	if (!match) {
		return null;
	}

	return { frontmatter: match[0], body: text.slice(match[0].length) };
}

/** Reads one top-level scalar key out of a frontmatter block, unquoted. */
function frontmatterValue(frontmatter, key) {
	const match = new RegExp(`^${key}:[ \\t]*(.*)$`, 'm').exec(frontmatter);

	if (!match) {
		return null;
	}

	return match[1].trim().replace(/^['"]|['"]$/g, '');
}

/** Whether a nested `metadata: internal: true` is set, which hides the skill from installers. */
function isInternal(frontmatter) {
	return /^metadata:\s*$[\s\S]*?^\s+internal:[ \t]*true\s*$/m.test(frontmatter);
}

/**
 * Frontmatter keys whose value is an unquoted plain scalar containing a colon followed by a
 * space, which YAML forbids.
 *
 * This is checked rather than parsed because the script carries no dependencies, and it is
 * checked at all because a regex reader like the one above happily returns a value that a
 * real YAML parser refuses to produce. A skill whose frontmatter does not parse cannot be
 * loaded by a host that uses a parser, and nothing else here would notice.
 */
function unparseableScalars(frontmatter) {
	return frontmatter
		.split('\n')
		.filter((line) => /^[a-z-]+:[ \t]+[^'"[{\s]/i.test(line))
		.filter((line) => /:\s/.test(line.slice(line.indexOf(':') + 1)))
		.map((line) => line.slice(0, line.indexOf(':')));
}

/**
 * Every bundled file a Markdown body points at, whether as a link or as a code span.
 *
 * Only bundle directories count. These bodies also carry illustrative links such as
 * `../src/config.py`, which demonstrate the citation format rather than pointing at anything,
 * and treating those as broken references would fail the very examples that teach the rule.
 */
function referencedPaths(body) {
	const found = new Set();

	for (const [, target] of body.matchAll(/\]\(((?:references|agents|assets|scripts)\/[^)\s]+)\)/g)) {
		found.add(target.split('#')[0]);
	}

	for (const [, target] of body.matchAll(/`((?:references|agents|assets|scripts)\/[^`\s]+)`/g)) {
		found.add(target);
	}

	return [...found].filter(Boolean);
}

/** Checks one skill directory against the specification, and against isolation when published. */
function checkSkill(name) {
	const skillPath = join(SKILL_DIR, name, 'SKILL.md');
	const label = `.claude/skills/${name}/SKILL.md`;

	if (!existsSync(skillPath)) {
		fail(label, 'no SKILL.md');

		return;
	}

	const text = readFileSync(skillPath, 'utf8');
	const parts = split(text);

	if (!parts) {
		fail(label, 'no frontmatter block');

		return;
	}

	const declared = frontmatterValue(parts.frontmatter, 'name');
	const description = frontmatterValue(parts.frontmatter, 'description');

	if (declared !== name) {
		fail(label, `frontmatter name "${declared}" does not match the directory name "${name}"`);
	}

	if (declared && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(declared)) {
		fail(label, `name "${declared}" must be lowercase alphanumeric with single separating hyphens`);
	}

	if (declared && declared.length > 64) {
		fail(label, `name is ${declared.length} characters, over the 64 the specification allows`);
	}

	if (!description) {
		fail(label, 'no description, which is how an agent decides when to use the skill');
	} else if (description.length > MAX_DESCRIPTION) {
		fail(label, `description is ${description.length} characters, over the ${MAX_DESCRIPTION} allowed`);
	}

	const bodyLines = parts.body.split('\n').length;

	if (bodyLines > MAX_BODY_LINES) {
		fail(label, `body is ${bodyLines} lines, over ${MAX_BODY_LINES}; move detail into references/`);
	}

	for (const key of unparseableScalars(parts.frontmatter)) {
		fail(label, `\`${key}\` is an unquoted scalar containing ": ", so the frontmatter does not parse as YAML`);
	}

	for (const target of referencedPaths(parts.body)) {
		if (!existsSync(join(SKILL_DIR, name, target))) {
			fail(label, `references "${target}", which does not exist in the skill directory`);
		}
	}

	// `metadata.internal` buys no exemption here. `gh skill` reads no visibility field, so it
	// lists and installs every skill in this directory, and a copied directory is the whole of
	// what its recipient gets.
	if (!frontmatterValue(parts.frontmatter, 'license')) {
		fail(label, 'an installer can offer any skill here, so it needs a license key');
	}

	if (!existsSync(join(SKILL_DIR, name, 'LICENSE.txt'))) {
		fail(label, 'an installer can offer any skill here, so it needs a LICENSE.txt beside it');
	}

	checkPluginManifest(name);
	checkInvocable(name, parts.frontmatter);

	// An internal skill names this repository's own prompt files on purpose, so the isolation
	// rule below, which exists to keep a recipient from following a path they will not have,
	// is the one thing it is exempt from.
	if (isInternal(parts.frontmatter)) {
		return;
	}

	for (const file of skillFiles(name)) {
		const contents = readFileSync(join(SKILL_DIR, name, file), 'utf8');

		if (/\.prompt\.md|\.github\/prompts/.test(contents)) {
			fail(`.claude/skills/${name}/${file}`, 'names a prompt file, which a downloaded skill will not have');
		}
	}
}

/**
 * Checks that a published skill can still be invoked by name.
 *
 * This is a policy of this repository rather than a rule of the specification, which defines
 * neither key. A published skill is one an adopter installs holding nothing but the directory
 * and the name on it, so a key that narrows when it activates, or who may reach it, takes away
 * the only handle that adopter has. An installable or internal skill is free to use both.
 *
 * @param {string} name Directory name of the skill under `.claude/skills/`.
 * @param {string} frontmatter The skill's frontmatter block.
 */
function checkInvocable(name, frontmatter) {
	if (!PUBLISHED.includes(name)) {
		return;
	}

	const label = `.claude/skills/${name}/SKILL.md`;

	if (/^user-invocable:[ \t]*(false|no|off|0)\s*$/im.test(frontmatter)) {
		fail(label, 'a published skill may not set `user-invocable: false`, which hides it from the / menu');
	}

	if (/^paths:/m.test(frontmatter)) {
		fail(
			label,
			'a published skill may not carry `paths:`, which limits when it activates; path-scope a rules file instead',
		);
	}
}

/**
 * Checks a skill's plugin manifest, where it has one. A skill without one is skipped silently.
 *
 * @param {string} name Directory name of the skill under `.claude/skills/`.
 */
function checkPluginManifest(name) {
	const manifestPath = join(SKILL_DIR, name, PLUGIN_MANIFEST);
	const label = `.claude/skills/${name}/${PLUGIN_MANIFEST}`;

	if (!existsSync(manifestPath)) {
		return;
	}

	let manifest;

	try {
		manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
	} catch (error) {
		fail(label, `does not parse as JSON: ${error.message}`);

		return;
	}

	if (manifest.name !== name) {
		fail(label, `name "${manifest.name}" does not match the directory name "${name}"`);
	}

	if (!manifest.version) {
		fail(label, 'no version, which a host uses to tell one loaded copy from another');
	}

	// A manifest may point `agents` at somewhere other than the default directory. Either way the
	// paths it names travel with the skill, so a broken one breaks in the recipient's copy.
	const declaredAgents = manifest.agents ? [manifest.agents].flat() : [];

	for (const target of declaredAgents) {
		if (!existsSync(join(SKILL_DIR, name, target))) {
			fail(label, `declares agent "${target}", which does not exist in the skill directory`);
		}
	}
}

/**
 * Every file inside a skill that travels with it and could name a path: top-level Markdown, every
 * file one level deep in each bundle directory, plus the plugin manifest. The manifest carries a
 * `description`, so it can name a prompt file exactly as a body can, and it ships in the copied
 * directory either way.
 */
function skillFiles(name) {
	const root = join(SKILL_DIR, name);
	const files = readdirSync(root).filter((file) => file.endsWith('.md'));

	for (const dir of BUNDLE_DIRS) {
		if (!existsSync(join(root, dir))) {
			continue;
		}

		files.push(...readdirSync(join(root, dir)).map((file) => `${dir}/${file}`));
	}

	if (existsSync(join(root, PLUGIN_MANIFEST))) {
		files.push(PLUGIN_MANIFEST);
	}

	return files;
}

/** Checks that a prompt still works as the only file someone holds. */
function checkPrompt(file) {
	const label = `.github/prompts/${file}`;
	const text = readFileSync(join(PROMPT_DIR, file), 'utf8');
	const parts = split(text);

	// Counted over the whole file rather than the body, because frontmatter is what a reader
	// scrolls past too.
	const budget = MAX_PROMPT_CHARS_BY_FILE[file] ?? MAX_PROMPT_CHARS;

	if (text.length > budget) {
		fail(label, `is ${text.length} characters against a budget of ${budget}; condense rather than raising it`);
	}

	if (!parts) {
		fail(label, 'no frontmatter block');

		return;
	}

	// A relative link fails only when its target actually exists here. That is the tell that the
	// author linked to a real file, which will not travel with the copied prompt. A target that
	// resolves to nothing is an illustration of the citation format, and those are the point.
	for (const [, target] of parts.body.matchAll(/\]\(([^)\s]+)\)/g)) {
		if (/^(https?:|#|mailto:)/.test(target)) {
			continue;
		}

		if (existsSync(resolve(PROMPT_DIR, target.split('#')[0]))) {
			fail(label, `links to "${target}", a real file that will not travel with a copied prompt`);
		}
	}

	for (const dir of BUNDLE_DIRS) {
		if (new RegExp(`\`${dir}/`).test(parts.body)) {
			fail(label, `names "${dir}/", which does not travel with a copied single file`);
		}
	}

	if (/SKILL\.md|\.claude\//.test(parts.body)) {
		fail(label, 'names the skill half, which a prompt reader will not have');
	}
}

const skills = existsSync(SKILL_DIR)
	? readdirSync(SKILL_DIR).filter((entry) => statSync(join(SKILL_DIR, entry)).isDirectory())
	: [];

const prompts = existsSync(PROMPT_DIR) ? readdirSync(PROMPT_DIR).filter((file) => file.endsWith('.prompt.md')) : [];

if (skills.length === 0 && prompts.length === 0) {
	console.log('No skills or prompts found. Nothing to check.');
	process.exit(0);
}

skills.forEach(checkSkill);
prompts.forEach(checkPrompt);

/** Which of the three states a skill is in, for the report. */
function state(name) {
	const text = readFileSync(join(SKILL_DIR, name, 'SKILL.md'), 'utf8');
	const parts = split(text);

	if (parts && isInternal(parts.frontmatter)) {
		return 'internal';
	}

	return PUBLISHED.includes(name) ? 'published' : 'installable';
}

for (const name of skills) {
	if (!failures.some((entry) => entry.file.includes(`/skills/${name}/`))) {
		console.log(`ok   ${name.padEnd(36)} ${state(name)}`);
	}
}

if (failures.length > 0) {
	console.error('');

	for (const { file, message } of failures) {
		console.error(`FAIL ${file}: ${message}`);
	}

	console.error(
		`\n${failures.length} problem(s). Each half is downloaded on its own, so a prompt may name ` +
			'nothing beside it and a skill may name nothing outside itself.',
	);
	process.exit(1);
}

const counts = skills.reduce((tally, name) => ({ ...tally, [state(name)]: (tally[state(name)] ?? 0) + 1 }), {});

console.log(
	`\nChecked ${skills.length} skill(s) and ${prompts.length} prompt(s): ` +
		`${counts.published ?? 0} published, ${counts.installable ?? 0} installable, ${counts.internal ?? 0} internal.`,
);
