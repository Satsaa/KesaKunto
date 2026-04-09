import { defineQuery } from "trellis-api-core";
import { z } from "zod";
import type { SearchOffers as Types } from "./search-offers.types";

const baseUrl = process.env["K_RUOKA_API_BASE_URL"];

if (!baseUrl) {
	throw new Error("K_RUOKA_API_BASE_URL is not set.");
}

export namespace SearchOffers {
	export interface ClientOptions {
		fetchImpl?: typeof globalThis.fetch;
		headers?: Record<string, string>;
	}

	export const schema = z.object({
		storeId: z.string(),
		offset: z.number(),
		categoryPath: z.string(),
		language: z.string(),
	});

	export async function fetch(
		input: z.infer<typeof SearchOffers.schema>,
		options: ClientOptions = {},
	): Promise<Types.Output> {
		const url = new URL(`${baseUrl}/search-offers/`);
		url.searchParams.set("storeId", input.storeId);
		url.searchParams.set("offset", String(input.offset));
		url.searchParams.set("categoryPath", input.categoryPath);
		url.searchParams.set("language", input.language);

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
			throw new Error(`search-offers returned ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as Types.Output;
	}

	export const definition = defineQuery<z.infer<typeof SearchOffers.schema>>({
		input: SearchOffers.schema,
		handler: ({ input, ctx }) =>
			SearchOffers.fetch(input, {
				fetchImpl: globalThis.fetch,
				headers: ctx.headers,
			}),
	});
}
