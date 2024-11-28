import ts from "typescript";
import { assert, describe, expect, expectTypeOf, it } from "vitest";

import { createSourceFileAndTypeChecker } from "../../test/utils";
import {
	isConditionalType,
	isEnumType,
	isIntersectionType,
	isObjectType,
	isTypeParameter,
	isUnionOrIntersectionType,
	isUnionType,
	isUniqueESSymbolType,
} from "./single";

function getTypeForTypeNode(sourceText: string) {
	const { sourceFile, typeChecker } =
		createSourceFileAndTypeChecker(sourceText);
	const node = sourceFile.statements.at(-1) as ts.TypeAliasDeclaration;

	return typeChecker.getTypeAtLocation(node);
}

function getTypeForVariable(sourceText: string) {
	const { sourceFile, typeChecker } =
		createSourceFileAndTypeChecker(sourceText);
	const node = sourceFile.statements.at(-1) as ts.VariableStatement;

	return typeChecker.getTypeAtLocation(
		node.declarationList.declarations[0].name,
	);
}

describe("isConditionalType", () => {
	it.each([
		[false, "type Test = 1;"],
		[true, "type Test<T> = T extends 1 ? 2 : 3;"],
	])("returns %j when given %s", (expected, sourceText) => {
		const type = getTypeForTypeNode(sourceText);

		expect(isConditionalType(type)).toBe(expected);
	});
});

describe("isEnumType", () => {
	it.each([
		[false, "class Box {} type _ = Box;"],
		[true, "enum Values {} type _ = Values;"],
	])("returns %j when given %s", (expected, sourceText) => {
		const type = getTypeForTypeNode(sourceText);

		expect(isEnumType(type)).toBe(expected);
	});
});

describe("isIntersectionType", () => {
	it.each([
		[false, "type Test = 1;"],
		[true, "type Test<T> = T & 1"],
	])("returns %j when given %s", (expected, sourceText) => {
		const type = getTypeForTypeNode(sourceText);

		expect(isIntersectionType(type)).toBe(expected);
	});
});

describe("isObjectType", () => {
	it.each([
		[false, "type Test = 1;"],
		[true, "type Test = {};"],
	])("returns %j when given %s", (expected, sourceText) => {
		const type = getTypeForTypeNode(sourceText);

		expect(isObjectType(type)).toBe(expected);
	});
});

describe("isTypeParameter", () => {
	it("should return true for a type parameter", () => {
		const sourceText = `type Test<T> = { foo: string };`;
		const { sourceFile, typeChecker } =
			createSourceFileAndTypeChecker(sourceText);

		const node = sourceFile.statements.at(-1) as ts.TypeAliasDeclaration;
		const typeParameter = node.typeParameters?.[0];
		expect(typeParameter).toBeDefined();

		const typeParameterType = typeChecker.getTypeAtLocation(typeParameter!);

		// type test - see https://github.com/JoshuaKGoldberg/ts-api-utils/issues/382
		if (isTypeParameter(typeParameterType)) {
			expectTypeOf(typeParameterType).toEqualTypeOf<ts.TypeParameter>();
		} else {
			expectTypeOf(typeParameterType).toEqualTypeOf<ts.Type>();
		}

		expect(isTypeParameter(typeParameterType)).toBe(true);
	});

	it("should return false when not a type parameter", () => {
		const sourceText = `type Test<T> = { foo: string };`;
		const typeParameterType = getTypeForTypeNode(sourceText);

		// type test - see https://github.com/JoshuaKGoldberg/ts-api-utils/issues/382
		if (isTypeParameter(typeParameterType)) {
			expectTypeOf(typeParameterType).toEqualTypeOf<ts.TypeParameter>();
		} else {
			expectTypeOf(typeParameterType).toEqualTypeOf<ts.Type>();
		}

		expect(isTypeParameter(typeParameterType)).toBe(false);
	});
});

describe("isUnionOrIntersectionType", () => {
	it.each([
		[false, "type Test = 1;"],
		[true, "type Test<T> = T | {};"],
		[true, "type Test<T> = T & {};"],
	])("returns %j when given %s", (expected, sourceText) => {
		const type = getTypeForTypeNode(sourceText);

		expect(isUnionOrIntersectionType(type)).toBe(expected);
	});
});

describe("isUniqueESSymbolType", () => {
	it.each([
		[false, "declare const test: 1;"],
		[true, "declare const test: unique symbol"],
	])("returns %j when given %s", (expected, sourceText) => {
		const type = getTypeForVariable(sourceText);

		expect(isUniqueESSymbolType(type)).toBe(expected);
	});
});

describe("isUnionType", () => {
	it.each([
		[false, "type Test<T> = T & {};"],
		[true, "type Test<T> = T | {};"],
	])("returns %j when given %s", (expected, sourceText) => {
		const type = getTypeForTypeNode(sourceText);

		expect(isUnionType(type)).toBe(expected);
	});
});
