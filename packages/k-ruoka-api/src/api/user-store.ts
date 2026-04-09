import { defineQuery } from "trellis-api-core";
import { z } from "zod";
import type { UserStore as Types } from "./user-store.types";

const baseUrl = process.env["K_RUOKA_API_BASE_URL"];

if (!baseUrl) {
	throw new Error("K_RUOKA_API_BASE_URL is not set.");
}

const userStoreUrl = `${baseUrl}/user/store`;

export namespace UserStore {
	export interface ClientOptions {
		fetchImpl?: typeof globalThis.fetch;
		headers?: Record<string, string>;
	}

	export const schema = z.object({
		selectedStoreSlug: z.string(),
	});

	export async function fetch(
		input: z.infer<typeof UserStore.schema>,
		options: ClientOptions = {},
	): Promise<Types.Output> {
		const response = await (options.fetchImpl ?? globalThis.fetch)(userStoreUrl, {
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
			throw new Error(`user/store returned ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as Types.Output;
	}

	export const definition = defineQuery<z.infer<typeof UserStore.schema>>({
		input: UserStore.schema,
		handler: ({ input, ctx }) =>
			UserStore.fetch(input, {
				fetchImpl: globalThis.fetch,
				headers: ctx.headers,
			}),
	});
}
