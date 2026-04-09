import { defineQuery } from "trellis-api-core";
import { z } from "zod";
import type { StoresSearch as Types } from "./stores-search.types";

const baseUrl = process.env["K_RUOKA_API_BASE_URL"];

if (!baseUrl) {
	throw new Error("K_RUOKA_API_BASE_URL is not set.");
}

const storesSearchUrl = `${baseUrl}/stores/search`;

export namespace StoresSearch {
	export interface ClientOptions {
		fetchImpl?: typeof globalThis.fetch;
		headers?: Record<string, string>;
	}

	export const schema = z.object({
		query: z.string(),
		offset: z.number(),
		limit: z.number(),
		zipCode: z.string(),
		deliveryZipCode: z.string().optional(),
		chains: z
			.array(z.enum(["kcitymarket", "ksupermarket", "kmarket"]))
			.optional(),
		closeTo: z
			.object({
				latitude: z.number(),
				longitude: z.number(),
			})
			.optional(),
		storeIds: z.array(z.string()).optional(),
		selectedStoreId: z.string(),
	});

	export async function fetch(
		input: z.infer<typeof StoresSearch.schema>,
		options: ClientOptions = {},
	): Promise<Types.Output> {
		const response = await (options.fetchImpl ?? globalThis.fetch)(storesSearchUrl, {
			method: "POST",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
				origin: "https://www.k-ruoka.fi",
				referer: "https://www.k-ruoka.fi/kauppa/tarjoushaku",
				"x-k-build-number": "29989",
				...options.headers,
			},
			body: JSON.stringify(input),
		});

		if (!response.ok) {
			throw new Error(`stores/search returned ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as Types.Output;
	}

	export const definition = defineQuery<z.infer<typeof StoresSearch.schema>>({
		input: StoresSearch.schema,
		handler: ({ input, ctx }) =>
			StoresSearch.fetch(input, {
				fetchImpl: globalThis.fetch,
				headers: ctx.headers,
			}),
	});
}
