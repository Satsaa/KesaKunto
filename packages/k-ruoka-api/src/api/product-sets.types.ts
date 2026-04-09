import type { LocalizedFinnishEnglishSwedish } from "../types/LocalizedFinnishEnglishSwedish";
import type { StringUrl } from "../types/StringUrl";
import type { UrlSlug } from "../types/UrlSlug";
import type { ProductSets as ProductSetsReference } from "./api-references/product-sets.reference";

export namespace ProductSets {
	export interface Output {
		id: string;
		title: LocalizedFinnishEnglishSwedish;
		description: LocalizedFinnishEnglishSwedish;
		imageUrl: StringUrl;
		products: string[];
		urlSlug: UrlSlug;
		type: string;
		upsell: boolean;
		productOrder: string;
		offerTagId?: null;
	}

	export type ReferenceOutput = ProductSetsReference.Output;
}
