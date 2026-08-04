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

/** Directories a skill may bundle, per the Agent Skills specification. */
const BUNDLE_DIRS = ['references', 'agents', 'assets', 'scripts'];

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

/** Every Markdown file inside a skill, one level of bundle directory deep. */
function skillFiles(name) {
	const root = join(SKILL_DIR, name);
	const files = readdirSync(root).filter((file) => file.endsWith('.md'));

	for (const dir of BUNDLE_DIRS) {
		if (!existsSync(join(root, dir))) {
			continue;
		}

		files.push(...readdirSync(join(root, dir)).map((file) => `${dir}/${file}`));
	}

	return files;
}

/** Checks that a prompt still works as the only file someone holds. */
function checkPrompt(file) {
	const label = `.github/prompts/${file}`;
	const parts = split(readFileSync(join(PROMPT_DIR, file), 'utf8'));

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
