import type { Expect, NotAny } from "type-test-core";
import type { FetchOffers } from "../src/api/fetch-offers.types";
import type { OfferCategories } from "../src/api/offer-categories.types";
import type { OfferCategory } from "../src/api/offer-category.types";
import type { ProductSets } from "../src/api/product-sets.types";
import type { Product } from "../src/api/product.types";
import type { SearchOffers } from "../src/api/search-offers.types";
import type { StoresSearch } from "../src/api/stores-search.types";
import type { UserStore } from "../src/api/user-store.types";
import type { IsBackwardCompatible } from "./type-compat";

type _NoAny1 = Expect<NotAny<FetchOffers.Output>>;
type _NoAny2 = Expect<NotAny<OfferCategories.Output>>;
type _NoAny3 = Expect<NotAny<OfferCategory.Output>>;
type _NoAny4 = Expect<NotAny<Product.Output>>;
type _NoAny5 = Expect<NotAny<ProductSets.Output>>;
type _NoAny6 = Expect<NotAny<SearchOffers.Output>>;
type _NoAny7 = Expect<NotAny<StoresSearch.Output>>;
type _NoAny8 = Expect<NotAny<UserStore.Output>>;

type _FetchOffersCompat = Expect<
	IsBackwardCompatible<FetchOffers.ReferenceOutput, FetchOffers.Output>
>;
type _OfferCategoriesCompat = Expect<
	IsBackwardCompatible<OfferCategories.ReferenceOutput, OfferCategories.Output>
>;
type _OfferCategoryCompat = Expect<
	IsBackwardCompatible<OfferCategory.ReferenceOutput, OfferCategory.Output>
>;
type _ProductCompat = Expect<IsBackwardCompatible<Product.ReferenceOutput, Product.Output>>;
type _ProductSetsCompat = Expect<
	IsBackwardCompatible<ProductSets.ReferenceOutput, ProductSets.Output>
>;
type _SearchOffersCompat = Expect<
	IsBackwardCompatible<SearchOffers.ReferenceOutput, SearchOffers.Output>
>;
type _StoresSearchCompat = Expect<
	IsBackwardCompatible<StoresSearch.ReferenceOutput, StoresSearch.Output>
>;
type _UserStoreCompat = Expect<
	IsBackwardCompatible<UserStore.ReferenceOutput, UserStore.Output>
>;
