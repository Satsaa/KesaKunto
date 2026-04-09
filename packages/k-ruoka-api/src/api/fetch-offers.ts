import { defineQuery } from "trellis-api-core";
import { z } from "zod";
import type { FetchOffers as Types } from "./fetch-offers.types";

const baseUrl = process.env["K_RUOKA_API_BASE_URL"];

if (!baseUrl) {
	throw new Error("K_RUOKA_API_BASE_URL is not set.");
}

const fetchOffersUrl = `${baseUrl}/fetch-offers`;

export namespace FetchOffers {
	export interface ClientOptions {
		fetchImpl?: typeof globalThis.fetch;
		headers?: Record<string, string>;
	}

	export const schema = z.object({
		storeId: z.string(),
		offerIds: z.array(z.string()),
		pricing: z.object({}),
	});

	export async function fetch(
		input: z.infer<typeof FetchOffers.schema>,
		options: ClientOptions = {},
	): Promise<Types.Output> {
		const response = await (options.fetchImpl ?? globalThis.fetch)(fetchOffersUrl, {
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
			throw new Error(`fetch-offers returned ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as Types.Output;
	}

	export const definition = defineQuery<z.infer<typeof FetchOffers.schema>>({
		input: FetchOffers.schema,
		handler: ({ input, ctx }) =>
			FetchOffers.fetch(input, {
				fetchImpl: globalThis.fetch,
				headers: ctx.headers,
			}),
	});
}
