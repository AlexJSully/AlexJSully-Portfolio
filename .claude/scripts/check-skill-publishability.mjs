#!/usr/bin/env node
// Checks that every skill under `.claude/skills/` is valid against the Agent Skills
// specification, that each half of a published pair still works when it is the only
// thing someone has, and, through `plugin-manifests.mjs`, that every skill an installer may
// offer is also installable as an agent plugin.
//
// The two halves of a pair carry the same objective, not the same bytes: a skill may bundle
// `references/`, `agents/`, and `assets/` that a single prompt file cannot. Whether they still
// aim at the same outcome is a judgement, so it belongs to the `prompt-skill-sync` subagent.
// What is left here is what a machine can decide.
//
// Run with no arguments. Reports every failure, then exits 1 if there were any.
import { existsSync, readFileSync, readdirSync, realpathSync } from 'fs';
import { join, resolve } from 'path';
import { isDirectory, isFile, isInside } from './file-system.mjs';
import { MARKETPLACE_MANIFEST, PLUGIN_MANIFEST, SHADOWING_MARKETPLACES, checkPlugins } from './plugin-manifests.mjs';

const REPO_ROOT = resolve(import.meta.dirname, '..', '..');
const PROMPT_DIR = join(REPO_ROOT, '.github', 'prompts');
const SKILL_DIR = join(REPO_ROOT, '.claude', 'skills');

/**
 * Skills published for use outside this repository. Only these are held to the agnosticism
 * bar, because a skill written for this repository alone may name this repository's paths. Here,
 * membership reports a skill as `published` and subjects it to {@link checkInvocable}.
 *
 * Every other skill is either `installable`, meaning an installer offers it without holding it
 * to that bar, or `internal`, meaning `metadata.internal: true` keeps it out of `npx skills`
 * discovery.
 */
const PUBLISHED = ['audit-docs', 'audit-pr', 'typescript-code-and-test-standards'];

/** The spec caps the body at 500 lines; longer belongs in `references/`. */
const MAX_BODY_LINES = 500;

/** The spec caps `description` at 1024 characters, because it loads at startup. */
const MAX_DESCRIPTION = 1024;

/**
 * The character budget for one prompt file, which a reader scrolls whole with no `references/` to
 * move detail into. Characters rather than lines, because a line in these files is a paragraph.
 * `wc -c` counts bytes rather than UTF-16 code units, so it reads slightly high on non-ASCII text.
 */
const MAX_PROMPT_CHARS = 52_000;

/** Budgets overriding {@link MAX_PROMPT_CHARS}; `audit-docs` is held tighter because its subject is narrower. */
const MAX_PROMPT_CHARS_BY_FILE = { 'audit-docs.prompt.md': 36_000 };

/**
 * Directories a skill may bundle. The specification defines `references/`, `assets/`, and
 * `scripts/`; `agents/` is a host extension, read only where a host loads the directory as a
 * plugin, and inert everywhere else.
 */
const BUNDLE_DIRS = ['references', 'agents', 'assets', 'scripts'];

const failures = [];

/** Each skill's state, worked out once, because the checks and the report each ask for it. */
const states = new Map();

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

/** Returns whether a nested `metadata: internal: true` is set, which keeps the skill out of `npx skills` discovery. */
function isInternal(frontmatter) {
	return /^metadata:\s*$[\s\S]*?^\s+internal:[ \t]*true\s*$/m.test(frontmatter);
}

/**
 * Returns the frontmatter keys whose value is an unquoted plain scalar containing a colon followed
 * by a space, which YAML forbids. Matched by pattern rather than parsed, since the script has no
 * dependencies: {@link frontmatterValue} accepts such a value, but a host with a YAML parser cannot
 * load the skill.
 */
function unparseableScalars(frontmatter) {
	return frontmatter
		.split('\n')
		.filter((line) => /^[a-z-]+:[ \t]+[^'"[{\s]/i.test(line))
		.filter((line) => /:\s/.test(line.slice(line.indexOf(':') + 1)))
		.map((line) => line.slice(0, line.indexOf(':')));
}

/**
 * Returns every bundled file a Markdown body points at, whether as a link or as a code span.
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

/** Returns which of the three states a skill is in, reading its SKILL.md only the first time. */
function state(name) {
	if (!states.has(name)) {
		states.set(name, readState(name));
	}

	return states.get(name);
}

/** Reads a skill's state from its frontmatter and the `PUBLISHED` list. */
function readState(name) {
	const parts = split(readFileSync(join(SKILL_DIR, name, 'SKILL.md'), 'utf8'));

	if (parts && isInternal(parts.frontmatter)) {
		return 'internal';
	}

	return PUBLISHED.includes(name) ? 'published' : 'installable';
}

/** Checks one skill directory against the specification, the licence and invocability policies, and, unless it is internal, isolation. */
function checkSkill(name) {
	const skillPath = join(SKILL_DIR, name, 'SKILL.md');
	const label = `.claude/skills/${name}/SKILL.md`;

	if (!isFile(skillPath)) {
		fail(label, 'no SKILL.md');

		return;
	}

	const parts = split(readFileSync(skillPath, 'utf8'));

	if (!parts) {
		fail(label, 'no frontmatter block');

		return;
	}

	checkFrontmatter(name, parts.frontmatter, label);
	checkBody(name, parts.body, label);
	checkLicence(name, parts.frontmatter, label);
	checkInvocable(name, parts.frontmatter);
	checkIsolation(name, parts.frontmatter);
}

/**
 * Checks the frontmatter keys the specification constrains: a `name` matching the directory in the
 * allowed format and length, a `description` within its limit, and every value parsing as YAML.
 *
 * @param {string} name Directory name of the skill under `.claude/skills/`.
 * @param {string} frontmatter The skill's frontmatter block.
 * @param {string} label Repository-relative path of the skill's SKILL.md, for reporting.
 */
function checkFrontmatter(name, frontmatter, label) {
	const declared = frontmatterValue(frontmatter, 'name');
	const description = frontmatterValue(frontmatter, 'description');

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

	for (const key of unparseableScalars(frontmatter)) {
		fail(label, `\`${key}\` is an unquoted scalar containing ": ", so the frontmatter does not parse as YAML`);
	}
}

/**
 * Checks the body of a SKILL.md: its length against the specification's cap, and every bundled file
 * it points at resolving inside the skill directory.
 *
 * @param {string} name Directory name of the skill under `.claude/skills/`.
 * @param {string} body The Markdown beneath the frontmatter.
 * @param {string} label Repository-relative path of the skill's SKILL.md, for reporting.
 */
function checkBody(name, body, label) {
	// A trailing newline ends the last line rather than starting another.
	const bodyLines = body.replace(/\n$/, '').split('\n').length;

	if (bodyLines > MAX_BODY_LINES) {
		fail(label, `body is ${bodyLines} lines, over ${MAX_BODY_LINES}; move detail into references/`);
	}

	const skillRoot = join(SKILL_DIR, name);

	for (const target of referencedPaths(body)) {
		const resolved = resolve(skillRoot, target);

		if (!existsSync(resolved)) {
			fail(label, `references "${target}", which does not exist in the skill directory`);
		} else if (!isInside(realpathSync(resolved), realpathSync(skillRoot))) {
			fail(label, `references "${target}", which resolves outside the skill directory, so no install copies it`);
		}
	}
}

/**
 * Checks that a skill carries its licence twice over: a `license` key in its frontmatter and a
 * `LICENSE.txt` beside it.
 *
 * @param {string} name Directory name of the skill under `.claude/skills/`.
 * @param {string} frontmatter The skill's frontmatter block.
 * @param {string} label Repository-relative path of the skill's SKILL.md, for reporting.
 */
function checkLicence(name, frontmatter, label) {
	// `metadata.internal` buys no exemption here. `gh skill` reads no visibility field, so it
	// lists and installs every skill in this directory, and a copied directory is the whole of
	// what its recipient gets.
	if (!frontmatterValue(frontmatter, 'license')) {
		fail(label, 'an installer can offer any skill here, so it needs a license key');
	}

	if (!isFile(join(SKILL_DIR, name, 'LICENSE.txt'))) {
		fail(label, 'an installer can offer any skill here, so it needs a LICENSE.txt beside it');
	}
}

/**
 * Checks that no file travelling with a skill names a prompt file, which a recipient of the copied
 * directory will not have.
 *
 * @param {string} name Directory name of the skill under `.claude/skills/`.
 * @param {string} frontmatter The skill's frontmatter block.
 */
function checkIsolation(name, frontmatter) {
	// An internal skill names this repository's own prompt files on purpose, so it is exempt from
	// this rule.
	if (isInternal(frontmatter)) {
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
 * Returns every file inside a skill that travels with it and could name a path: top-level Markdown, every
 * file one level deep in each bundle directory, plus the plugin manifest. The manifest carries a
 * `description`, so it can name a prompt file exactly as a body can, and it ships in the copied
 * directory either way.
 *
 * A symbolic link is followed, so a linked file is scanned as the file it resolves to, and an entry
 * that is not a file, such as a directory or a link to nothing, is skipped.
 */
function skillFiles(name) {
	const root = join(SKILL_DIR, name);
	const files = readdirSync(root).filter((file) => file.endsWith('.md') && isFile(join(root, file)));

	for (const dir of BUNDLE_DIRS) {
		if (!isDirectory(join(root, dir))) {
			continue;
		}

		const bundled = readdirSync(join(root, dir)).filter((file) => isFile(join(root, dir, file)));

		files.push(...bundled.map((file) => `${dir}/${file}`));
	}

	if (isFile(join(root, PLUGIN_MANIFEST))) {
		files.push(PLUGIN_MANIFEST);
	}

	return files;
}

/** Checks a prompt against its character budget, and that it still works as the only file someone holds. */
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

/**
 * Prints an `ok` line for every skill and for the marketplace where nothing failed, then either every
 * failure, exiting 1, or the totals by state.
 *
 * @param {string[]} skills Directory names under `.claude/skills/`.
 * @param {string[]} prompts File names under `.github/prompts/`.
 */
function report(skills, prompts) {
	for (const name of skills) {
		if (!failures.some((entry) => entry.file.includes(`/skills/${name}/`))) {
			console.log(`ok   ${name.padEnd(36)} ${state(name)}`);
		}
	}

	if (!failures.some((entry) => [MARKETPLACE_MANIFEST, ...SHADOWING_MARKETPLACES].includes(entry.file))) {
		console.log(`ok   ${MARKETPLACE_MANIFEST.padEnd(36)} marketplace`);
	}

	if (failures.length > 0) {
		console.error('');

		for (const { file, message } of failures) {
			console.error(`FAIL ${file}: ${message}`);
		}

		console.error(`\n${failures.length} problem(s).`);
		process.exit(1);
	}

	const byState = Object.groupBy(skills, state);
	const published = byState.published?.length ?? 0;
	const installable = byState.installable?.length ?? 0;
	const internal = byState.internal?.length ?? 0;

	console.log(
		`\nChecked ${skills.length} skill(s) and ${prompts.length} prompt(s): ` +
			`${published} published, ${installable} installable, ${internal} internal.`,
	);
}

const skills = isDirectory(SKILL_DIR)
	? readdirSync(SKILL_DIR).filter((entry) => isDirectory(join(SKILL_DIR, entry)))
	: [];

const prompts = isDirectory(PROMPT_DIR)
	? readdirSync(PROMPT_DIR).filter((file) => file.endsWith('.prompt.md') && isFile(join(PROMPT_DIR, file)))
	: [];

if (skills.length === 0 && prompts.length === 0) {
	console.log('No skills or prompts found. Nothing to check.');
	process.exit(0);
}

skills.forEach(checkSkill);
prompts.forEach(checkPrompt);

// Only an internal skill is withheld from the marketplace. Every other one is already offered by
// `npx skills`, so leaving it out there would make the two catalogues disagree without anyone
// deciding they should.
const offered = skills.filter((name) => isFile(join(SKILL_DIR, name, 'SKILL.md')) && state(name) !== 'internal');

failures.push(...checkPlugins(skills, offered));

report(skills, prompts);
