// File-system predicates shared by the skill checks. `isFile` and `isDirectory` follow a symbolic
// link to what it points at, because `npx skills` copies a linked file's contents in its place, so
// a check reads what a recipient receives. `isInside` compares paths as given.
import { statSync } from 'fs';
import { isAbsolute, relative, sep } from 'path';

/**
 * Returns whether `path` is a regular file once any symbolic link is followed. A missing path or a
 * link to nothing is not a file.
 *
 * @param {string} path Absolute path to test.
 * @returns {boolean} True when `path` resolves to a regular file.
 */
export function isFile(path) {
	return statSync(path, { throwIfNoEntry: false })?.isFile() ?? false;
}

/**
 * Returns whether `path` is a directory once any symbolic link is followed. A missing path or a
 * link to nothing is not a directory.
 *
 * @param {string} path Absolute path to test.
 * @returns {boolean} True when `path` resolves to a directory.
 */
export function isDirectory(path) {
	return statSync(path, { throwIfNoEntry: false })?.isDirectory() ?? false;
}

/**
 * Returns whether `path` is `root` or sits beneath it. Both are compared as given, so pass real
 * paths to rule out a symbolic link leading out of `root`.
 *
 * @param {string} path Absolute path to test.
 * @param {string} root Absolute path of the directory it must stay within.
 * @returns {boolean} True when `path` does not leave `root`.
 */
export function isInside(path, root) {
	const fromRoot = relative(root, path);
	const leavesRoot = fromRoot === '..' || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot);

	return !leavesRoot;
}
