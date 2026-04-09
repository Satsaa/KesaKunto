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
import type { MinMaxRange } from "../types/MinMaxRange";
import type { MinRange } from "../types/MinRange";
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
import type { FetchOffers as FetchOffersReference } from "./api-references/fetch-offers.reference";

export namespace FetchOffers {
	export interface Output {
		storeId: StoreId;
		offers: Offer[];
	}

	export type ReferenceOutput = FetchOffersReference.Output;

	export interface Offer {
		id: OfferId;
		localizedTitle: LocalizedFinnishEnglishSwedish;
		products: ProductReference[];
		image: StringUrl;
		pricing: Pricing;
		normalPricing: NormalPricing;
		offerType: OfferType;
		campaignId: CampaignId;
		offerNameId: string;
	}

	type ProductReference = ScoredProductReference<ProductDetails>;

	interface ProductDetails {
		type: string;
		id: Ean;
		ean: Ean;
		baseEan: Ean;
		localizedName: LocalizedFinnishEnglishSwedish;
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
		brand: Brand;
	}

	export interface Brand extends BrandSummary {
		subBrand: BrandSummary;
	}

	interface ProductAttributes {
		ean: Ean;
		section: string;
		urlSlug: UrlSlug;
		description: Description;
		labelName: LocalizedFiSvOptionalEn;
		marketingName: LocalizedFiSvEn;
		origin: Origin<LocalizedFiSvEn>;
		measurements: Measurements;
		meta: Meta;
		pimId: string;
		image: ImageRef;
		subColour?: LocalizedFiSvEn | null;
	}

	export interface Description {}

	interface Mobilescan {
		pricing: MobilescanPricing;
		discountLimited: boolean;
		vat: number;
	}

	interface MobilescanPricing {
		normal: Normal;
		discount: Discount;
		libraryVersion: string;
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
		discountSource: string;
	}

	interface Pricing {
		unit: LocalizedFiSv;
		discountPercentage: string;
		discountPercentageRange: MinRange;
		discountType: DiscountType;
		discountAvailability: Availability;
	}

	interface NormalPricing {
		price: number;
		unit: LocalizedFiSv;
		priceRange: MinMaxRange;
	}
}
