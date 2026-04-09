import { defineDefinitions, defineGroups } from "trellis-api-core";
import { z } from "zod";

export interface AppDefinitionExtras {
	auth: "public" | "required";
}

const ValueId = z.union([z.literal(0), z.literal(1)]);

export const groups = defineGroups(({ collection, object, value }) => ({
	sharedValue: value(),
	values: collection(
		object({
			child: value(),
		}),
	),
}));

export const definitions = defineDefinitions<AppDefinitionExtras>()(({ query, mutation }) => ({
	sharedValue: {
		get: query({
			input: z.object({}),
			auth: "public",
			dependsOn: [groups.sharedValue],
		}),
		increment: mutation({
			input: z.object({
				delta: z.number(),
			}),
			auth: "public",
			invalidates: [groups.sharedValue],
		}),
	},
	values: {
		list: query({
			input: z.object({}),
			auth: "public",
			dependsOn: [groups.values],
		}),
		reset: mutation({
			input: z.object({}),
			auth: "public",
			invalidates: [groups.values],
		}),
		getById: query({
			input: z.object({
				id: ValueId,
			}),
			auth: "public",
			dependsOn: ({ id }) => [groups.values(id)],
		}),
		getChildById: query({
			input: z.object({
				id: ValueId,
			}),
			auth: "public",
			dependsOn: ({ id }) => [groups.values(id).child],
		}),
		incrementById: mutation({
			input: z.object({
				id: ValueId,
				delta: z.number(),
			}),
			auth: "public",
			invalidates: ({ id }) => [groups.values(id)],
		}),
		incrementChildById: mutation({
			input: z.object({
				id: ValueId,
				delta: z.number(),
			}),
			auth: "public",
			invalidates: ({ id }) => [groups.values(id).child],
		}),
	},
}));
