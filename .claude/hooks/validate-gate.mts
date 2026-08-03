#!/usr/bin/env node
// Enforces the validation mandate in CLAUDE.md: a session that changed code, tests,
// config, or docs may not finish until the quality gates have been run.
//
// Registered on three events in `.claude/settings.json`:
//   PostToolUse (Write|Edit|MultiEdit|Bash) - mark the session dirty, record gates run
//   SubagentStop (validator)                - credit every gate to the delegated run
//   Stop                                    - block once while gates are outstanding
//
// The hook is structural, never evaluative. It records whether a gate was *run*, not
// whether it *passed*, because inferring pass or fail from tool output would either nag
// after a clean run or clear after a red one. Confirming exit codes is the agent's job.
//
// Run via `node --experimental-strip-types` (no build step, no dependencies).
// Type-stripping-safe TypeScript only: type annotations / interfaces, no enums,
// namespaces, or parameter properties.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { isAbsolute, join, relative } from 'path';

interface ToolInput {
	file_path?: string;
	command?: string;
}

interface HookPayload {
	hook_event_name?: string;
	session_id?: string;
	cwd?: string;
	tool_name?: string;
	tool_input?: ToolInput;
	stop_hook_active?: boolean;
}

interface GateState {
	dirty: boolean;
	gates: string[];
}

/** Every gate `npm run validate` runs that can also run on a developer machine. */
const GATES = ['prettier', 'eslint', 'tsc', 'jest', 'build', 'markdown'];

/** Maps a shell command to the gates it runs. */
const GATE_PATTERNS: [RegExp, string[]][] = [
	[/npm run validate\b/, GATES],
	[/npm run prettier\b/, ['prettier']],
	[/npm run eslint\b/, ['eslint']],
	[/npm run tsc(?![:\w])/, ['tsc']],
	[/npm run test:jest\b/, ['jest']],
	[/npm run build\b/, ['build']],
	[/npm run lint:markdown\b/, ['markdown']],
];

const REMINDER =
	'This change requires validation. Before you finish, run the quality gates and confirm ' +
	'each reaches exit code 0: `npm run prettier`, `npm run eslint`, `npm run tsc`, ' +
	'`npm run test:jest`, `npm run build`, `npm run lint:markdown`. Check the actual exit ' +
	'code rather than scrolling the output, and fix any failure rather than reporting around ' +
	'it. Delegating the run to the `validator` subagent keeps the output out of this context.';

/** Path to this session's marker, kept outside the repository so it never reaches `git status`. */
function statePath(sessionId: string): string {
	return join(tmpdir(), 'claude-validate-gate', `${sessionId}.json`);
}

function readState(sessionId: string): GateState | null {
	try {
		return JSON.parse(readFileSync(statePath(sessionId), 'utf-8')) as GateState;
	} catch {
		return null;
	}
}

function writeState(sessionId: string, state: GateState): void {
	const target = statePath(sessionId);

	try {
		mkdirSync(join(tmpdir(), 'claude-validate-gate'), { recursive: true });
		writeFileSync(target, JSON.stringify(state), 'utf-8');
	} catch {
		// A marker that cannot be written degrades the gate to a no-op rather than
		// breaking the session.
	}
}

function clearState(sessionId: string): void {
	try {
		rmSync(statePath(sessionId), { force: true });
	} catch {
		// Nothing to clean up.
	}
}

/**
 * Whether editing this file should require validation.
 *
 * Markdown counts because `lint:markdown` is one of the gates. Most of the agent-tooling tree
 * is excluded even so: ESLint skips everything under `.claude`, while Prettier and markdownlint
 * do reach most of it, and the exclusion accepts that gap rather than marking the session dirty
 * on every edit to a rule or skill file.
 *
 * The mirrored `SKILL.md` files are the exception, because a desync there is worth catching.
 * The prompt-and-skill sync check itself is not a gate; it runs on demand via
 * `make -f .claude/Makefile sync-prompts`.
 */
function requiresValidation(filePath: string, cwd: string): boolean {
	if (!filePath) return false;

	const rel = isAbsolute(filePath) ? relative(cwd, filePath) : filePath;

	if (rel.startsWith('..')) return false;

	if (/^\.claude\/skills\/audit-[^/]+\/SKILL\.md$/.test(rel)) return true;

	if (rel.startsWith('.claude/') || rel.includes('/.claude/')) return false;

	if (rel.startsWith('src/') || rel.startsWith('cypress/') || rel.startsWith('jest/')) return true;

	if (rel.endsWith('.md')) return true;

	// Root-level configuration: `package.json`, `eslint.config.js`, `.markdownlint-cli2.jsonc`,
	// and so on.
	return !rel.includes('/') && /\.(ts|tsx|mts|cts|js|mjs|cjs|json|jsonc|ya?ml)$/.test(rel);
}

/** Records gates run by a shell command, or marks the session dirty after an edit. */
function handlePostToolUse(payload: HookPayload, sessionId: string): void {
	const toolName = payload.tool_name ?? '';

	if (toolName === 'Bash') {
		const state = readState(sessionId);

		if (!state?.dirty) process.exit(0);

		const command = payload.tool_input?.command ?? '';
		const matched = GATE_PATTERNS.filter(([pattern]) => pattern.test(command)).flatMap(([, gates]) => gates);

		if (matched.length === 0) process.exit(0);

		writeState(sessionId, { dirty: true, gates: [...new Set([...state.gates, ...matched])] });
		process.exit(0);
	}

	if (toolName !== 'Write' && toolName !== 'Edit' && toolName !== 'MultiEdit') process.exit(0);

	if (!requiresValidation(payload.tool_input?.file_path ?? '', payload.cwd ?? process.cwd())) {
		process.exit(0);
	}

	const wasClean = !readState(sessionId)?.dirty;

	// A fresh change invalidates whatever was validated before it, so the gate list resets.
	writeState(sessionId, { dirty: true, gates: [] });

	// Remind once per clean-to-dirty transition rather than on every edit.
	if (wasClean) {
		process.stdout.write(
			JSON.stringify({
				hookSpecificOutput: {
					hookEventName: 'PostToolUse',
					additionalContext: REMINDER,
				},
			}),
		);
	}

	process.exit(0);
}

/** Blocks once while gates are outstanding, then releases so the gate can never deadlock. */
function handleStop(payload: HookPayload, sessionId: string): void {
	const state = readState(sessionId);

	if (!state?.dirty) process.exit(0);

	const missing = GATES.filter((gate) => !state.gates.includes(gate));

	if (missing.length === 0) {
		clearState(sessionId);
		process.exit(0);
	}

	// `stop_hook_active` means this hook already blocked this turn. Releasing keeps a gate
	// that cannot be satisfied in the current environment from looping.
	if (payload.stop_hook_active) process.exit(0);

	process.stderr.write(
		`This session changed code, tests, config, or docs, and ${missing.length} of ${GATES.length} ` +
			`quality gates have not been run: ${missing.join(', ')}. Run \`npm run validate\` and confirm ` +
			'it reaches exit code 0 before finishing. The chain is `&&`, so if it stops partway, the gates ' +
			'after the failure did not run: finish them individually (`npm run prettier`, ' +
			'`npm run eslint`, `npm run tsc`, `npm run test:jest`, `npm run build`, ' +
			'`npm run lint:markdown`) rather than ' +
			'treating them as passed.',
	);
	process.exit(2);
}

function main(): void {
	let payload: HookPayload;

	try {
		payload = JSON.parse(readFileSync(0, 'utf-8')) as HookPayload;
	} catch {
		process.exit(0);
	}

	const sessionId = payload.session_id ?? '';

	if (!sessionId) process.exit(0);

	const event = payload.hook_event_name ?? '';

	if (event === 'PostToolUse') handlePostToolUse(payload, sessionId);

	if (event === 'SubagentStop') {
		const state = readState(sessionId);

		if (state?.dirty) writeState(sessionId, { dirty: true, gates: [...GATES] });

		process.exit(0);
	}

	if (event === 'Stop') handleStop(payload, sessionId);

	process.exit(0);
}

main();
