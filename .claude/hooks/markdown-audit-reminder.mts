#!/usr/bin/env node
// PostToolUse hook (Write / Edit / MultiEdit). When a Markdown file is edited,
// injects a non-blocking reminder to follow the documentation-authoring rules.
//
// Run via `node --experimental-strip-types` (no build step, no dependencies).
// The path-scoped rule `.claude/rules/docs-authoring.md` is the primary carrier
// of this guidance; this hook is the guaranteed, deterministic backstop.
//
// Type-stripping-safe TypeScript only: type annotations / interfaces, no enums,
// namespaces, or parameter properties.

import { readFileSync } from 'fs';

interface ToolInput {
	file_path?: string;
}

interface HookPayload {
	tool_name?: string;
	tool_input?: ToolInput;
}

const REMINDER =
	'This edit changed a Markdown file. Follow `.claude/rules/docs-authoring.md` ' +
	'(canonical spec: `.github/prompts/audit-docs.prompt.md`): document only what the ' +
	'code provably does (no speculation), no subjective adjectives, reference files as ' +
	'clickable markdown links to files (never bare names or directories), keep snippets ' +
	'to 3-10 lines, and give every Mermaid diagram `accTitle` + `accDescr`. ' +
	'To audit docs against the code, run the `/audit-docs` skill.';

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
	const isMarkdown = filePath.endsWith('.md') || filePath.endsWith('.mdx');
	// Skip the agent-tooling tree so editing rules/skills/this hook doesn't nag.
	const isAgentTooling = filePath.includes('/.claude/') || filePath.startsWith('.claude/');
	if (!isMarkdown || isAgentTooling) {
		process.exit(0);
	}

	process.stdout.write(
		JSON.stringify({
			hookSpecificOutput: {
				hookEventName: 'PostToolUse',
				additionalContext: REMINDER,
			},
		}),
	);
	process.exit(0);
}

main();
