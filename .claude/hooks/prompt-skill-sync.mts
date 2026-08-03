#!/usr/bin/env node
// PostToolUse hook (Write / Edit / MultiEdit). When one half of a published audit is
// edited, names the other half, which now has to be judged against it.
//
// Run via `node --experimental-strip-types` (no build step, no dependencies).
// The path-scoped rule `.claude/rules/prompt-skill-sync.md` carries the contract; this hook
// is the deterministic backstop; `.claude/scripts/check-skill-publishability.mjs` decides the
// mechanical rules, on demand through `make -f .claude/Makefile check-skills`. That check is
// deliberately not part of `npm run validate`: the repository must build, test, and lint with
// no agent tooling present.
//
// Type-stripping-safe TypeScript only: type annotations / interfaces, no enums,
// namespaces, or parameter properties.
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';

interface ToolInput {
	file_path?: string;
}

interface HookPayload {
	tool_name?: string;
	tool_input?: ToolInput;
}

/** Audits that ship as both a prompt file and a skill directory. */
const PAIRED = ['audit-docs', 'audit-pr', 'audit-quality'];

/**
 * Returns the other half of a published audit, or null for any other file.
 *
 * Scoped to the named audits so that an unpaired skill, such as
 * `typescript-code-and-test-standards`, is not told its counterpart is a prompt that was
 * never written.
 */
function counterpartOf(filePath: string): string | null {
	// Resolved from this file's own location so the existence test does not silently fail
	// when the hook runs from another directory.
	const repoRoot = resolve(import.meta.dirname, '..', '..');

	const promptMatch = /\.github\/prompts\/([^/]+)\.prompt\.md$/.exec(filePath);
	if (promptMatch) {
		const counterpart = `.claude/skills/${promptMatch[1]}/SKILL.md`;

		// A prompt with no skill yet is not half of a pair, and the checker skips it too.
		return existsSync(join(repoRoot, counterpart)) ? counterpart : null;
	}

	const skillMatch = /\.claude\/skills\/([^/]+)\/SKILL\.md$/.exec(filePath);
	if (skillMatch && PAIRED.includes(skillMatch[1])) {
		return `.github/prompts/${skillMatch[1]}.prompt.md`;
	}

	return null;
}

function main(): void {
	let payload: HookPayload;
	try {
		payload = JSON.parse(readFileSync(0, 'utf-8')) as HookPayload;
	} catch {
		process.exit(0);
	}

	const toolName = payload.tool_name ?? '';
	if (toolName !== 'Write' && toolName !== 'Edit' && toolName !== 'MultiEdit') {
		process.exit(0);
	}

	const filePath = payload.tool_input?.file_path ?? '';
	const counterpart = counterpartOf(filePath);
	if (!counterpart) {
		process.exit(0);
	}

	process.stdout.write(
		JSON.stringify({
			hookSpecificOutput: {
				hookEventName: 'PostToolUse',
				additionalContext:
					`This file is one half of a published audit. Its counterpart \`${counterpart}\` must still ` +
					'aim at the same outcome: the two carry the same objective and the same hard rules, and only ' +
					'the skill half may carry bundled depth. That is a judgement rather than a diff, so hand both ' +
					'to the `prompt-skill-sync` subagent before finishing, and run ' +
					'`make -f .claude/Makefile check-skills` for the mechanical rules. Each half is downloaded ' +
					'alone: the prompt may name nothing beside it, and the skill may name nothing outside itself.',
			},
		}),
	);
	process.exit(0);
}

main();
