import type { CategorySlug } from "../types/CategorySlug";
import type { LocalizedFinnishEnglishSwedish } from "../types/LocalizedFinnishEnglishSwedish";
import type { OfferCategories as OfferCategoriesReference } from "./api-references/offer-categories.reference";

export namespace OfferCategories {
	export interface Output {
		offerCategories: OfferCategory[];
	}

	export type ReferenceOutput = OfferCategoriesReference.Output;

	interface OfferCategory {
		slug: CategorySlug;
		count: number;
		name: LocalizedFinnishEnglishSwedish;
	}
}
