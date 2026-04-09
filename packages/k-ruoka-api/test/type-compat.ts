import type { IsAny } from "type-test-core";

type KeyName<Key extends PropertyKey> = Key extends string | number ? `${Key}` : never;

type OptionalKeys<T extends object> = {
	[K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type RequiredKeys<T extends object> = Exclude<keyof T, OptionalKeys<T>>;

type Normalize<T> = T extends unknown
	? IsAny<T> extends true
		? T
		: T extends string
			? string
			: T extends number
				? number
				: T extends boolean
					? boolean
					: T extends bigint
						? bigint
						: T extends symbol
							? symbol
							: T extends readonly (infer Item)[]
								? Normalize<Item>[]
								: T extends object
									? { [K in keyof T]: Normalize<T[K]> }
									: T
	: never;

type MissingKeys<
	Old extends object,
	New extends object,
	Path extends string,
> = Exclude<keyof Old, keyof New> extends infer Key
	? Key extends PropertyKey
		? `${Path}.${KeyName<Key>}: missing in new type`
		: never
	: never;

type NewRequiredKeys<
	Old extends object,
	New extends object,
	Path extends string,
> = Exclude<RequiredKeys<New>, keyof Old> extends infer Key
	? Key extends PropertyKey
		? `${Path}.${KeyName<Key>}: added as new required key`
		: never
	: never;

type OptionalityTightening<
	Old extends object,
	New extends object,
	Path extends string,
> = Extract<OptionalKeys<Old>, keyof New> extends infer Key
	? Key extends keyof New
		? Key extends OptionalKeys<New>
			? never
			: `${Path}.${KeyName<Key>}: optional became required`
		: never
	: never;

type PropertyCompatibility<
	Old extends object,
	New extends object,
	Path extends string,
> = {
	[K in Extract<keyof Old, keyof New>]: CompatibilityErrors<
		Old[K],
		New[K],
		`${Path}.${KeyName<K>}`
	>;
}[Extract<keyof Old, keyof New>];

type ObjectCompatibilityErrors<
	Old extends object,
	New extends object,
	Path extends string,
> =
	| MissingKeys<Old, New, Path>
	| NewRequiredKeys<Old, New, Path>
	| OptionalityTightening<Old, New, Path>
	| PropertyCompatibility<Old, New, Path>;

type CompatibilityErrors<
	Old,
	New,
	Path extends string = "root",
> = IsAny<Old> extends true
	? `${Path}: old type is any`
	: IsAny<New> extends true
		? `${Path}: new type is any`
		: Normalize<Old> extends infer NormalizedOld
			? Normalize<New> extends infer NormalizedNew
				? [NormalizedOld] extends [readonly (infer OldItem)[]]
					? [NormalizedNew] extends [readonly (infer NewItem)[]]
						? CompatibilityErrors<OldItem, NewItem, `${Path}[]`>
						: `${Path}: old is array but new is not`
					: [NormalizedOld] extends [object]
						? [NormalizedNew] extends [object]
							? ObjectCompatibilityErrors<NormalizedOld, NormalizedNew, Path>
							: `${Path}: old is object but new is not`
						: [NormalizedOld] extends [NormalizedNew]
							? never
							: `${Path}: new type is narrower`
				: never
			: never;

export type IsBackwardCompatible<Old, New> = [CompatibilityErrors<Old, New>] extends [never]
	? true
	: CompatibilityErrors<Old, New>;
