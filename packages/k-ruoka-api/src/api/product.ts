import { defineQuery } from "trellis-api-core";
import { z } from "zod";
import type { Product as Types } from "./product.types";

const baseUrl = process.env["K_RUOKA_API_BASE_URL"];

if (!baseUrl) {
	throw new Error("K_RUOKA_API_BASE_URL is not set.");
}

export namespace Product {
	export interface ClientOptions {
		fetchImpl?: typeof globalThis.fetch;
		headers?: Record<string, string>;
	}

	export const schema = z.object({
		slug: z.string(),
		storeId: z.string(),
		returnLocalProductsFromOtherStores: z.boolean(),
	});

	export async function fetch(
		input: z.infer<typeof Product.schema>,
		options: ClientOptions = {},
	): Promise<Types.Output> {
		const url = new URL(`${baseUrl}/v4/products/${input.slug}`);
		url.searchParams.set("storeId", input.storeId);
		url.searchParams.set(
			"returnLocalProductsFromOtherStores",
			String(input.returnLocalProductsFromOtherStores),
		);

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
			throw new Error(`product returned ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as Types.Output;
	}

	export const definition = defineQuery<z.infer<typeof Product.schema>>({
		input: Product.schema,
		handler: ({ input, ctx }) =>
			Product.fetch(input, {
				fetchImpl: globalThis.fetch,
				headers: ctx.headers,
			}),
	});
}
