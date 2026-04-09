import { defineQuery } from "trellis-api-core";
import { z } from "zod";
import type { ProductSets as Types } from "./product-sets.types";

const baseUrl = process.env["K_RUOKA_API_BASE_URL"];

if (!baseUrl) {
	throw new Error("K_RUOKA_API_BASE_URL is not set.");
}

export namespace ProductSets {
	export interface ClientOptions {
		fetchImpl?: typeof globalThis.fetch;
		headers?: Record<string, string>;
	}

	export const schema = z.object({
		storeId: z.string(),
	});

	export async function fetch(
		input: z.infer<typeof ProductSets.schema>,
		options: ClientOptions = {},
	): Promise<Types.Output> {
		const url = new URL(`${baseUrl}/v2/product-sets/${input.storeId}`);

		const response = await (options.fetchImpl ?? globalThis.fetch)(url, {
			method: "GET",
			headers: {
				accept: "application/json",
				origin: "https://www.k-ruoka.fi",
				referer: "https://www.k-ruoka.fi/kauppa/tarjoushaku",
				"x-k-build-number": "29989",
				...options.headers,
			},
		});

		if (!response.ok) {
			throw new Error(`product-sets returned ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as Types.Output;
	}

	export const definition = defineQuery<z.infer<typeof ProductSets.schema>>({
		input: ProductSets.schema,
		handler: ({ input, ctx }) =>
			ProductSets.fetch(input, {
				fetchImpl: globalThis.fetch,
				headers: ctx.headers,
			}),
	});
}
