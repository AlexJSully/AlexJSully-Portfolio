// Tests for the file-system predicates in `file-system.mjs`, against real files, directories, and
// symbolic links in a temporary directory. Run with `make -f .claude/Makefile test-scripts`.
import assert from 'assert/strict';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'fs';
// `node:test` has no unprefixed name, unlike the other built-in modules imported here.
import { afterEach, beforeEach, describe, it } from 'node:test';
import { tmpdir } from 'os';
import { join } from 'path';
import { isDirectory, isFile, isInside } from './file-system.mjs';

let root;

beforeEach(() => {
	root = mkdtempSync(join(tmpdir(), 'file-system-'));
	writeFileSync(join(root, 'file.md'), '# File\n');
	mkdirSync(join(root, 'folder'));
	symlinkSync(join(root, 'file.md'), join(root, 'link-to-file'));
	symlinkSync(join(root, 'folder'), join(root, 'link-to-folder'));
	symlinkSync(join(root, 'gone.md'), join(root, 'link-to-nothing'));
});

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('isFile', () => {
	for (const { entry, expected } of [
		{ entry: 'file.md', expected: true },
		{ entry: 'link-to-file', expected: true },
		{ entry: 'folder', expected: false },
		{ entry: 'link-to-folder', expected: false },
		{ entry: 'link-to-nothing', expected: false },
		{ entry: 'missing.md', expected: false },
	]) {
		it(`returns ${expected} for ${entry}`, () => {
			assert.equal(isFile(join(root, entry)), expected);
		});
	}
});

describe('isDirectory', () => {
	for (const { entry, expected } of [
		{ entry: 'folder', expected: true },
		{ entry: 'link-to-folder', expected: true },
		{ entry: 'file.md', expected: false },
		{ entry: 'link-to-nothing', expected: false },
		{ entry: 'missing', expected: false },
	]) {
		it(`returns ${expected} for ${entry}`, () => {
			assert.equal(isDirectory(join(root, entry)), expected);
		});
	}
});

describe('isInside', () => {
	for (const { label, path, expected } of [
		{ label: 'the root itself', path: '/skills/alpha', expected: true },
		{ label: 'a path beneath the root', path: '/skills/alpha/agents/helper.md', expected: true },
		{ label: 'a child whose name starts with two dots', path: '/skills/alpha/..cache/x', expected: true },
		{ label: 'a sibling of the root', path: '/skills/beta/SKILL.md', expected: false },
		{ label: 'the parent of the root', path: '/skills', expected: false },
	]) {
		it(`returns ${expected} for ${label}`, () => {
			assert.equal(isInside(path, '/skills/alpha'), expected);
		});
	}
});
