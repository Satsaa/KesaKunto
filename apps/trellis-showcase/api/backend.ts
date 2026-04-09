import {
	createEndpoints,
	createHttpHandler,
	createTrellisApp,
	type HandlerTree,
	type ImplementedTree,
} from "trellis-api-core";
import { definitions } from "./definitions";

let sharedValue = 0;
let values: Record<0 | 1, { value: number; child: number }> = {
	0: { value: 0, child: 0 },
	1: { value: 0, child: 0 },
};

function readValue(id: 0 | 1) {
	return {
		id,
		value: values[id].value,
		child: values[id].child,
	};
}

export function resetTestState() {
	sharedValue = 0;
	values = {
		0: { value: 0, child: 0 },
		1: { value: 0, child: 0 },
	};
}

export const handlers = {
	sharedValue: {
		get: async () => sharedValue,
		increment: async ({ input }) => {
			sharedValue += input.delta;
			return sharedValue;
		},
	},
	values: {
		list: async () => [readValue(0), readValue(1)],
		reset: async () => {
			values = {
				0: { value: 0, child: 0 },
				1: { value: 0, child: 0 },
			};
			return [readValue(0), readValue(1)];
		},
		getById: async ({ input }) => readValue(input.id),
		getChildById: async ({ input }) => values[input.id].child,
		incrementById: async ({ input }) => {
			values[input.id].value += input.delta;
			return readValue(input.id);
		},
		incrementChildById: async ({ input }) => {
			values[input.id].child += input.delta;
			return values[input.id].child;
		},
	},
} satisfies HandlerTree<typeof definitions>;

export const endpoints = createEndpoints(definitions, handlers);

export type Api = ImplementedTree<typeof definitions, typeof handlers>;

export {
	createHttpHandler,
	createTrellisApp,
};
