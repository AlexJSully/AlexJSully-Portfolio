#!/usr/bin/env node
// Checks that each `.github/prompts/<name>.prompt.md` and its mirror
// `.claude/skills/<name>/SKILL.md` carry a byte-identical body below the
// frontmatter. Only the frontmatter differs: the prompt carries Copilot's
// keys, the skill carries the Agent Skills keys.
//
// Run with no arguments to check. Reports every divergent pair, then exits 1 if any diverged.
// `--fix=to-skill` copies each prompt body onto its skill, keeping the
// skill's own frontmatter. `--fix=to-prompt` does the reverse. The direction
// is never inferred, because guessing it would overwrite the edited side.
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PROMPT_DIR = join(REPO_ROOT, '.github', 'prompts');
const SKILL_DIR = join(REPO_ROOT, '.claude', 'skills');

/** Splits a Markdown file into its frontmatter block and the body beneath it. */
function split(text, path) {
	const match = /^---\r?\n[\s\S]*?\r?\n---\r?\n/.exec(text);

	if (!match) {
		throw new Error(`${path} has no frontmatter block`);
	}

	return { frontmatter: match[0], body: text.slice(match[0].length) };
}

/** Returns every prompt paired with the skill that mirrors it. */
function pairs() {
	if (!existsSync(PROMPT_DIR)) {
		return [];
	}

	return readdirSync(PROMPT_DIR)
		.filter((file) => file.endsWith('.prompt.md'))
		.map((file) => {
			const name = file.slice(0, -'.prompt.md'.length);

			return { name, promptPath: join(PROMPT_DIR, file), skillPath: join(SKILL_DIR, name, 'SKILL.md') };
		})
		.filter((pair) => existsSync(pair.skillPath));
}

/** Reports the first line where two bodies diverge, as a one-based line number. */
function firstDifference(a, b) {
	const left = a.split('\n');
	const right = b.split('\n');

	for (let i = 0; i < Math.max(left.length, right.length); i++) {
		if (left[i] !== right[i]) {
			return { line: i + 1, left: left[i] ?? '(end of file)', right: right[i] ?? '(end of file)' };
		}
	}

	return null;
}

const fixArg = process.argv.find((arg) => arg.startsWith('--fix='));
const direction = fixArg ? fixArg.slice('--fix='.length) : null;

if (direction && direction !== 'to-skill' && direction !== 'to-prompt') {
	console.error(`Unknown direction "${direction}". Use --fix=to-skill or --fix=to-prompt.`);
	process.exit(2);
}

const found = pairs();

if (found.length === 0) {
	console.log('No prompt and skill pairs found. Nothing to check.');
	process.exit(0);
}

let diverged = 0;

for (const { name, promptPath, skillPath } of found) {
	const prompt = split(readFileSync(promptPath, 'utf8'), promptPath);
	const skill = split(readFileSync(skillPath, 'utf8'), skillPath);

	if (prompt.body === skill.body) {
		if (!direction) {
			console.log(`ok   ${name}`);
		}

		continue;
	}

	if (direction === 'to-skill') {
		writeFileSync(skillPath, skill.frontmatter + prompt.body);
		console.log(`sync ${name}: prompt body copied onto the skill`);

		continue;
	}

	if (direction === 'to-prompt') {
		writeFileSync(promptPath, prompt.frontmatter + skill.body);
		console.log(`sync ${name}: skill body copied onto the prompt`);

		continue;
	}

	const diff = firstDifference(prompt.body, skill.body);
	console.error(`FAIL ${name}: bodies differ at body line ${diff.line}`);
	console.error(`  prompt: ${diff.left}`);
	console.error(`  skill:  ${diff.right}`);
	diverged++;
}

if (diverged > 0) {
	console.error(
		`\n${diverged} pair(s) out of sync. Edit one side, then run one of:\n` +
			'  make -f .claude/Makefile sync-prompts-to-skill\n' +
			'  make -f .claude/Makefile sync-prompts-to-prompt',
	);
	process.exit(1);
}

if (!direction) {
	console.log(`All ${found.length} prompt and skill pairs are in sync.`);
}
