#!/usr/bin/env node
// PostToolUse hook (Write / Edit / MultiEdit). When one half of a prompt-and-skill
// pair is edited, names the counterpart that now needs the same edit.
//
// Run via `node --experimental-strip-types` (no build step, no dependencies).
// The path-scoped rule `.claude/rules/prompt-skill-sync.md` is the primary carrier
// of this obligation; this hook is the guaranteed, deterministic backstop, and
// `.claude/scripts/check-prompt-skill-sync.mjs` is the gate `npm run validate` runs locally.
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

/**
 * Returns the counterpart path for either half of a pair, or null for any other file.
 *
 * The skill side is scoped to `audit-*` so that an unmirrored skill, such as
 * `typescript-code-and-test-standards`, does not get told its counterpart is a prompt
 * that was never written. This matches the `paths:` glob in the accompanying rule.
 */
function counterpartOf(filePath: string): string | null {
	// Resolved from this file's own location, as `check-prompt-skill-sync.mjs` does, so the
	// existence test does not silently fail when the hook runs from another directory.
	const repoRoot = resolve(import.meta.dirname, '..', '..');

	const promptMatch = /\.github\/prompts\/([^/]+)\.prompt\.md$/.exec(filePath);
	if (promptMatch) {
		const counterpart = `.claude/skills/${promptMatch[1]}/SKILL.md`;

		// A prompt with no skill yet is not half of a pair, and the checker skips it too.
		return existsSync(join(repoRoot, counterpart)) ? counterpart : null;
	}

	const skillMatch = /\.claude\/skills\/(audit-[^/]+)\/SKILL\.md$/.exec(filePath);
	if (skillMatch) {
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

	const editedPrompt = filePath.includes('/.github/prompts/');
	const direction = editedPrompt ? '--fix=to-skill' : '--fix=to-prompt';

	process.stdout.write(
		JSON.stringify({
			hookSpecificOutput: {
				hookEventName: 'PostToolUse',
				additionalContext:
					`This file is one half of a mirrored pair. Its counterpart \`${counterpart}\` carries a ` +
					'byte-identical body below the frontmatter, and `npm run validate` fails while the two differ. ' +
					`Mirror the edit before finishing: \`node .claude/scripts/check-prompt-skill-sync.mjs ${direction}\`, ` +
					'or run the `/sync-audit-prompts` skill. Only the frontmatter may differ between them, and the ' +
					'shared body must stay self-contained: no relative links and no reference to a sibling prompt, ' +
					'because each half is copied into other repositories on its own.',
			},
		}),
	);
	process.exit(0);
}

main();
