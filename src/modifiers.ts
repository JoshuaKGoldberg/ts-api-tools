// Code largely based on https://github.com/ajafff/tsutils
// Original license: https://github.com/ajafff/tsutils/blob/26b195358ec36d59f00333115aa3ffd9611ca78b/LICENSE

import * as ts from "typescript";

/**
 * Test if the given iterable contains a modifier of any of the given kinds.
 *
 * @category Modifier Utilities
 */
export function hasModifier(
	modifiers: Iterable<ts.Modifier> | undefined,
	...kinds: ts.ModifierSyntaxKind[]
): boolean {
	if (modifiers === undefined) return false;
	for (const modifier of modifiers)
		if (kinds.includes(modifier.kind)) return true;
	return false;
}
