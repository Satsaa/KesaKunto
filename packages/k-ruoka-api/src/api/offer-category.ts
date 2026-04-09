import { defineQuery } from "trellis-api-core";
import { z } from "zod";
import type { OfferCategory as Types } from "./offer-category.types";

const baseUrl = process.env["K_RUOKA_API_BASE_URL"];

if (!baseUrl) {
	throw new Error("K_RUOKA_API_BASE_URL is not set.");
}

const offerCategoryUrl = `${baseUrl}/offer-category`;

export namespace OfferCategory {
	export interface ClientOptions {
		fetchImpl?: typeof globalThis.fetch;
		headers?: Record<string, string>;
	}

	export const schema = z.object({
		storeId: z.string(),
		pricing: z.object({}),
		offset: z.number(),
		limit: z.number(),
		category: z.object({
			kind: z.literal("productCategory"),
			slug: z.string(),
		}),
	});

	export async function fetch(
		input: z.infer<typeof OfferCategory.schema>,
		options: ClientOptions = {},
	): Promise<Types.Output> {
		const response = await (options.fetchImpl ?? globalThis.fetch)(offerCategoryUrl, {
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
			throw new Error(`offer-category returned ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as Types.Output;
	}

	export const definition = defineQuery<z.infer<typeof OfferCategory.schema>>({
		input: OfferCategory.schema,
		handler: ({ input, ctx }) =>
			OfferCategory.fetch(input, {
				fetchImpl: globalThis.fetch,
				headers: ctx.headers,
			}),
	});
}
