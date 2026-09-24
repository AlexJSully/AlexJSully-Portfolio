// Checks what makes a skill directory installable as an agent plugin: each skill's own plugin
// manifest, and the marketplace at the repository root that lists them.
//
// These rules follow what VS Code, Claude Code, the Copilot CLI, and `npx skills` read, not the
// Agent Skills specification, so they change when one of those hosts does.
// `check-skill-publishability.mjs` runs them and reports the result.
import { existsSync, readFileSync, realpathSync } from 'fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'path';
import { fileURLToPath } from 'url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SKILL_DIR = join(REPO_ROOT, '.claude', 'skills');

/**
 * The manifest that makes a skill directory load in place as the plugin `<name>@skills-dir`, so the
 * files in `agents/` register as agents a run can delegate to instead of sitting there as unread
 * text. A marketplace install needs no manifest to find `agents/`, but every skill the marketplace
 * lists carries one, because its `description` is what the entry is checked against.
 *
 * Every bundled procedure is still written to be followed by opening its file, which needs no
 * manifest and no host support.
 */
export const PLUGIN_MANIFEST = join('.claude-plugin', 'plugin.json');

/**
 * Manifests a host reads ahead of `.claude-plugin/plugin.json`. VS Code prefers `.plugin/plugin.json`
 * and a root `plugin.json` declaring the Agent Plugins `$schema`, a format that finds skills only
 * under `skills/`, so the directory's own `SKILL.md` would load as nothing. The Copilot CLI prefers
 * all three. Each is a second copy of the name and description for hosts to disagree over.
 */
const COMPETING_PLUGIN_MANIFESTS = [
	'plugin.json',
	join('.plugin', 'plugin.json'),
	join('.github', 'plugin', 'plugin.json'),
];

/**
 * The catalogue that offers each skill as a plugin. It sits at the repository root because VS Code
 * looks for a marketplace nowhere else, and this is the one path under it that VS Code, Claude
 * Code, the Copilot CLI, and `npx skills` all read.
 */
export const MARKETPLACE_MANIFEST = join('.claude-plugin', 'marketplace.json');

/**
 * Marketplace paths that VS Code and the Copilot CLI try before `MARKETPLACE_MANIFEST`. The first
 * one found is the whole catalogue, so any of these would hide it.
 */
export const SHADOWING_MARKETPLACES = [
	'marketplace.json',
	join('.plugin', 'marketplace.json'),
	join('.github', 'plugin', 'marketplace.json'),
];

/**
 * The only keys a marketplace entry may carry. VS Code keeps `name`, `description`, `version`, and
 * `source` from an entry and drops the rest, so anything else, a component above all, would exist
 * in Claude Code alone. `version` is left out too, because it pins installs exactly as it does in
 * `plugin.json`.
 */
const ENTRY_KEYS = ['name', 'source', 'description'];

/**
 * Checks every skill's plugin manifest, then the marketplace that lists them.
 *
 * @param {string[]} skills Directory names under `.claude/skills/`.
 * @param {string[]} offered The skills an installer may offer, which the marketplace must list exactly.
 * @returns {{ file: string, message: string }[]} One entry per failure, empty when every rule holds.
 */
export function checkPlugins(skills, offered) {
	const failures = [];
	const fail = (file, message) => failures.push({ file, message });
	const manifests = new Map(skills.map((name) => [name, checkPluginManifest(name, fail)]));

	checkMarketplace(offered, manifests, fail);

	return failures;
}

/**
 * Reads a JSON file that must hold an object, reporting against `label` when it does not parse or
 * holds some other value.
 *
 * @param {string} path Absolute path of the file.
 * @param {string} label Repository-relative path the failure is reported against.
 * @param {(file: string, message: string) => void} fail Records one failure.
 * @returns {Record<string, unknown> | null} The parsed object, or `null` once the reason is reported.
 */
function readJsonObject(path, label, fail) {
	let value;

	try {
		value = JSON.parse(readFileSync(path, 'utf8'));
	} catch (error) {
		fail(label, `does not parse as JSON: ${error.message}`);

		return null;
	}

	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		fail(label, 'is not a JSON object');

		return null;
	}

	return value;
}

/**
 * Checks a skill's plugin manifest, where it has one, and that no competing manifest sits beside
 * it. Whether a skill needs one at all is the marketplace's question.
 *
 * @param {string} name Directory name of the skill under `.claude/skills/`.
 * @param {(file: string, message: string) => void} fail Records one failure.
 * @returns {Record<string, unknown> | null | undefined} The parsed manifest, `null` when it could
 *     not be read, or `undefined` when the skill has none.
 */
function checkPluginManifest(name, fail) {
	const manifestPath = join(SKILL_DIR, name, PLUGIN_MANIFEST);
	const label = `.claude/skills/${name}/${PLUGIN_MANIFEST}`;

	for (const competing of COMPETING_PLUGIN_MANIFESTS) {
		if (existsSync(join(SKILL_DIR, name, competing))) {
			fail(
				`.claude/skills/${name}/${competing}`,
				`a host reads this ahead of ${PLUGIN_MANIFEST}; keep one manifest`,
			);
		}
	}

	if (!existsSync(manifestPath)) {
		return undefined;
	}

	const manifest = readJsonObject(manifestPath, label, fail);

	if (!manifest) {
		return null;
	}

	if (manifest.name !== name) {
		fail(label, `name "${manifest.name}" does not match the directory name "${name}"`);
	}

	// Without a version, Claude Code keys a marketplace install on the commit it came from, so a
	// push to the default branch reaches recipients the way it already does through `npx skills`.
	if (Object.hasOwn(manifest, 'version')) {
		fail(label, 'sets a version, which pins Claude Code marketplace installs until someone bumps it');
	}

	if (Object.hasOwn(manifest, 'agents')) {
		checkAgentPaths(name, manifest.agents, label, fail);
	}

	return manifest;
}

/**
 * Checks the paths a manifest's `agents` key points at, in place of the default `agents/` folder.
 *
 * An install copies the skill directory and nothing beside it, so a path reaching outside that
 * directory resolves here and breaks in every recipient's copy. Claude Code also requires each
 * path to start with `./`.
 *
 * @param {string} name Directory name of the skill under `.claude/skills/`.
 * @param {unknown} agents The manifest's `agents` value, which should be a path or a list of paths.
 * @param {string} label Repository-relative path of the manifest, for reporting.
 * @param {(file: string, message: string) => void} fail Records one failure.
 */
function checkAgentPaths(name, agents, label, fail) {
	const skillRoot = join(SKILL_DIR, name);

	for (const target of [agents].flat()) {
		if (typeof target !== 'string' || !target.startsWith('./')) {
			fail(label, `declares agent ${JSON.stringify(target)}; each entry must be a path starting with "./"`);

			continue;
		}

		const resolved = resolve(skillRoot, target);

		if (!existsSync(resolved)) {
			fail(label, `declares agent "${target}", which does not exist in the skill directory`);
		} else if (!isInside(realpathSync(resolved), realpathSync(skillRoot))) {
			fail(label, `declares agent "${target}", which is outside the skill directory, so no install copies it`);
		}
	}
}

/**
 * Whether `path` is `root` or sits beneath it. Both are compared as given, so pass real paths to
 * rule out a symbolic link leading out of `root`.
 *
 * @param {string} path Absolute path to test.
 * @param {string} root Absolute path of the directory it must stay within.
 * @returns {boolean} True when `path` does not leave `root`.
 */
function isInside(path, root) {
	const fromRoot = relative(root, path);

	return fromRoot === '' || (fromRoot !== '..' && !fromRoot.startsWith(`..${sep}`) && !isAbsolute(fromRoot));
}

/**
 * Checks that the marketplace offers exactly the skills an installer may offer, each as a plugin
 * rooted at its own skill directory.
 *
 * A plugin rooted there is read the same way by every host: VS Code and Claude Code load the root
 * `SKILL.md` as its one skill, and `npx skills` still finds the directory through its ordinary
 * `.claude/skills/` scan. What the entry may say is narrow because the readers disagree about the
 * rest. `npx skills` skips a path that does not start with `./`, and VS Code shows the entry's
 * `description` rather than the manifest's, so the two copies are held equal.
 *
 * @param {string[]} offered The skills an installer may offer.
 * @param {Map<string, Record<string, unknown> | null | undefined>} manifests Each skill's manifest,
 *     as `checkPluginManifest` returned it.
 * @param {(file: string, message: string) => void} fail Records one failure.
 */
function checkMarketplace(offered, manifests, fail) {
	const label = MARKETPLACE_MANIFEST;

	for (const path of SHADOWING_MARKETPLACES) {
		if (existsSync(join(REPO_ROOT, path))) {
			fail(path, `VS Code and the Copilot CLI read this ahead of ${label}, so it hides that catalogue`);
		}
	}

	if (!existsSync(join(REPO_ROOT, label))) {
		fail(label, 'missing, so no skill is installable as a plugin');

		return;
	}

	const manifest = readJsonObject(join(REPO_ROOT, label), label, fail);

	if (!manifest) {
		return;
	}

	if (!manifest.name || !manifest.owner?.name) {
		fail(label, 'needs a `name` and an `owner.name`, which every host requires');
	}

	// VS Code resolves a `./` source under `pluginRoot` and Claude Code ignores it for one, so the
	// same entry would name two different directories.
	if (manifest.metadata?.pluginRoot !== undefined) {
		fail(label, 'sets `metadata.pluginRoot`, which VS Code and Claude Code apply differently');
	}

	if (!Array.isArray(manifest.plugins)) {
		fail(label, 'has no `plugins` array');

		return;
	}

	const listed = manifest.plugins.map((entry) => entry?.name);

	for (const name of offered.filter((skill) => !listed.includes(skill))) {
		fail(label, `does not list "${name}", which every other installer offers`);
	}

	for (const name of new Set(listed.filter((name, index) => listed.indexOf(name) !== index))) {
		fail(label, `lists "${name}" more than once`);
	}

	// A repeated entry is reported once above, so only its first occurrence is checked in full.
	for (const entry of manifest.plugins.filter((entry, index) => listed.indexOf(entry?.name) === index)) {
		checkMarketplaceEntry(entry, offered, manifests, fail);
	}
}

/**
 * Checks one marketplace entry against the skill directory it names.
 *
 * @param {Record<string, unknown>} entry One element of the marketplace's `plugins` array.
 * @param {string[]} offered Skills an installer may offer, which are the only names allowed.
 * @param {Map<string, Record<string, unknown> | null | undefined>} manifests Each skill's manifest.
 * @param {(file: string, message: string) => void} fail Records one failure.
 */
function checkMarketplaceEntry(entry, offered, manifests, fail) {
	const label = MARKETPLACE_MANIFEST;
	const name = entry?.name;

	if (!offered.includes(name)) {
		fail(label, `lists "${name}", which is not a skill an installer may offer`);

		return;
	}

	if (entry.source !== `./.claude/skills/${name}`) {
		fail(label, `"${name}" must have source "./.claude/skills/${name}", the directory its SKILL.md sits in`);
	}

	for (const key of Object.keys(entry).filter((key) => !ENTRY_KEYS.includes(key))) {
		fail(
			label,
			`"${name}" sets \`${key}\`; an entry carries only ${ENTRY_KEYS.join(', ')}, which every host reads alike`,
		);
	}

	if (typeof entry.description !== 'string' || !entry.description) {
		fail(label, `"${name}" has no description, which is the text VS Code lists it by`);
	}

	const manifest = manifests.get(name);

	if (manifest === undefined) {
		fail(label, `"${name}" has no ${PLUGIN_MANIFEST} to check its description against`);

		return;
	}

	// `checkPluginManifest` has already reported a manifest that could not be read.
	if (manifest && entry.description !== manifest.description) {
		fail(label, `"${name}" description differs from its ${PLUGIN_MANIFEST}; VS Code shows the entry's copy`);
	}
}
