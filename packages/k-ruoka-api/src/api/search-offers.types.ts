import type { AdInfo } from "../types/AdInfo";
import type { Availability } from "../types/Availability";
import type { BrandSummary } from "../types/BrandSummary";
import type { CampaignId } from "../types/CampaignId";
import type { Category } from "../types/Category";
import { DiscountType } from "../types/DiscountType";
import type { Ean } from "../types/Ean";
import type { ImageRef } from "../types/ImageRef";
import type { IsoDateTimeString } from "../types/IsoDateTimeString";
import type { LocalizedFiSv } from "../types/LocalizedFiSv";
import type { LocalizedFiSvEn } from "../types/LocalizedFiSvEn";
import type { LocalizedFiSvOptionalEn } from "../types/LocalizedFiSvOptionalEn";
import type { LocalizedFinnishEnglishSwedish } from "../types/LocalizedFinnishEnglishSwedish";
import type { Measurements } from "../types/Measurements";
import type { Meta } from "../types/Meta";
import type { OfferId } from "../types/OfferId";
import { OfferType } from "../types/OfferType";
import type { Origin } from "../types/Origin";
import type { ScoredProductReference } from "../types/ScoredProductReference";
import type { SoldBy } from "../types/SoldBy";
import type { StoreId } from "../types/StoreId";
import type { StoreRef } from "../types/StoreRef";
import type { StringUrl } from "../types/StringUrl";
import type { UnitPrice } from "../types/UnitPrice";
import type { UrlSlug } from "../types/UrlSlug";
import type { SearchOffers as SearchOffersReference } from "./api-references/search-offers.reference";

export namespace SearchOffers {
	export interface Output {
		totalHits: number;
		storeId: StoreId;
		results: Result[];
		categoryName: LocalizedFinnishEnglishSwedish;
		suggestions: Suggestions;
	}

	export type ReferenceOutput = SearchOffersReference.Output;

	interface Result {
		id: OfferId;
		localizedTitle: LocalizedFinnishEnglishSwedish;
		products: ProductReference[];
		image: StringUrl;
		pricing: Pricing;
		normalPricing: NormalPricing;
		offerType: OfferType;
		campaignId: CampaignId;
		score: number;
		offerNameId?: string | null;
	}

	type ProductReference = ScoredProductReference<ProductDetails>;

	interface ProductDetails {
		type: string;
		id: Ean;
		ean: Ean;
		baseEan: Ean;
		localizedName: LocalizedName;
		store: StoreRef;
		availability: Availability;
		isAvailable: boolean;
		category: Category<LocalizedFinnishEnglishSwedish>;
		productAttributes: ProductAttributes;
		images: StringUrl[];
		imageLastUpdate: IsoDateTimeString;
		popularity: number;
		kind: string;
		isReferenceEan: boolean;
		section: string;
		mobilescan: Mobilescan;
		adInfo: AdInfo;
		brand?: Brand | null;
		ingredientId?: string | null;
	}

	interface LocalizedName {
		english?: string | null;
		finnish: string;
		swedish: string;
	}

	interface ProductAttributes {
		ean: Ean;
		section: string;
		urlSlug: UrlSlug;
		description: Description;
		labelName: LocalizedFiSv;
		marketingName: MarketingName;
		origin: Origin<LocalizedFiSvEn>;
		measurements: Measurements;
		meta: Meta;
		pimId: string;
		image: ImageRef;
		responsibility: ResponsibilityEntity[];
		ingredientId?: string | null;
		concepts: Concept[];
	}

	interface Description {}

	interface MarketingName {
		en?: string | null;
		fi: string;
		sv?: string | null;
	}

	interface ResponsibilityEntity {
		en: string;
		fi: string;
		sv: string;
		name: string;
	}

	interface Concept {
		id: string;
		localizedName: LocalizedFiSvEn;
	}

	interface Mobilescan {
		pricing: MobilescanPricing;
		lowestPriceBeforeDiscount?: LowestPriceBeforeDiscount | null;
		discountLimited: boolean;
		vat: number;
	}

	interface MobilescanPricing {
		normal: Normal;
		discount?: Discount | null;
		libraryVersion: string;
		batch?: Batch | null;
	}

	interface Normal {
		unit: string;
		localizedUnit: LocalizedFiSv;
		isApproximate: boolean;
		soldBy: SoldBy;
		price: number;
		unitPrice: UnitPrice;
	}

	interface Discount {
		unit: string;
		localizedUnit: LocalizedFiSv;
		isApproximate: boolean;
		soldBy: SoldBy;
		price: number;
		unitPrice: UnitPrice;
		discountPercentage: number;
		discountPercentageText: string;
		discountType: DiscountType;
		startDate: IsoDateTimeString;
		endDate: IsoDateTimeString;
		validNumberOfDaysLeft: number;
		discountAvailability: Availability;
		campaignId: CampaignId;
		storeCampaignId?: string | null;
		discountSource: string;
		reason?: string | null;
	}

	interface Batch {
		unit: string;
		localizedUnit: LocalizedFiSv;
		isApproximate: boolean;
		soldBy: SoldBy;
		price: number;
		discountPercentage: number;
		discountPercentageText: string;
		discountType: DiscountType;
		startDate: IsoDateTimeString;
		endDate: IsoDateTimeString;
		validNumberOfDaysLeft: number;
		discountAvailability: Availability;
		unitPrice: UnitPrice;
		amount: number;
		campaignId: CampaignId;
		discountSource: string;
	}

	interface LowestPriceBeforeDiscount {
		value: number;
		unit: string;
	}

	interface Brand extends BrandSummary {
		subBrand?: BrandSummary | null;
	}

	interface Pricing {
		price: number;
		unit: LocalizedFiSv;
		discountType: DiscountType;
		discountAvailability: Availability;
		discountPercentage?: string | null;
		discountPercentageRange?: PriceRange | null;
	}

	interface PriceRange {
		min: number;
		max?: number | null;
	}

	interface NormalPricing {
		price: number;
		unit: LocalizedFiSv;
		priceRange: PriceRange;
	}

	interface Suggestions {
		categories: SuggestedCategory[];
	}

	interface SuggestedCategory {
		name: LocalizedFinnishEnglishSwedish;
		slug: string;
		imageUrl: StringUrl;
		count: number;
	}
}
