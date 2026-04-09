import {
	createApiClient,
	type TrellisClientConfig,
} from "trellis-api-core";
import { FetchOffers } from "./api/fetch-offers";
import { OfferCategory } from "./api/offer-category";
import { OfferCategories } from "./api/offer-categories";
import { Product } from "./api/product";
import { ProductSets } from "./api/product-sets";
import { SearchOffers } from "./api/search-offers";
import { StoresSearch } from "./api/stores-search";
import { UserStore } from "./api/user-store";

export const kRuokaApi = {
	fetchOffers: FetchOffers.definition,
	offerCategory: OfferCategory.definition,
	offerCategories: OfferCategories.definition,
	product: Product.definition,
	productSets: ProductSets.definition,
	searchOffers: SearchOffers.definition,
	storesSearch: StoresSearch.definition,
	userStore: UserStore.definition,
};

export function createClient(config: TrellisClientConfig) {
	return createApiClient<KRuokaApi, typeof kRuokaApi>({
		...config,
		definitions: kRuokaApi,
	});
}

export type KRuokaApi = typeof kRuokaApi;

export {
	FetchOffers,
	OfferCategory,
	OfferCategories,
	Product,
	ProductSets,
	SearchOffers,
	StoresSearch,
	UserStore,
};
