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
import type { MinRange } from "../types/MinRange";
import type { OfferId } from "../types/OfferId";
import { OfferType } from "../types/OfferType";
import type { Origin } from "../types/Origin";
import type { ScoredProductReference } from "../types/ScoredProductReference";
import type { SoldBy } from "../types/SoldBy";
import type { StoreRef } from "../types/StoreRef";
import type { StringUrl } from "../types/StringUrl";
import type { UnitPrice } from "../types/UnitPrice";
import type { UrlSlug } from "../types/UrlSlug";
import type { OfferCategory as OfferCategoryReference } from "./api-references/offer-category.reference";

export namespace OfferCategory {
	export interface Output {
		totalHits: number;
		name: LocalizedFinnishEnglishSwedish;
		offers: Offer[];
		paginatedOfferIds: unknown[];
	}

	export type ReferenceOutput = OfferCategoryReference.Output;

	interface Offer {
		id: OfferId;
		localizedTitle: LocalizedFinnishEnglishSwedish;
		image: StringUrl;
		pricing: Pricing;
		normalPricing: NormalPricing;
		offerType: OfferType;
		campaignId: CampaignId;
		product?: ProductReference | null;
		offerNameId?: string | null;
	}

	interface Pricing {
		price: number;
		unit: LocalizedFiSv;
		discountType: DiscountType;
		discountAvailability: Availability;
		discountPercentage?: string | null;
		discountPercentageRange?: MinRange | null;
	}

	interface NormalPricing {
		price: number;
		unit: LocalizedFiSv;
		priceRange: MinRange;
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
		ingredientId?: string | null;
		productAttributes: ProductAttributes;
		images: StringUrl[];
		imageLastUpdate: IsoDateTimeString;
		popularity: number;
		kind: string;
		isReferenceEan: boolean;
		section: string;
		mobilescan: Mobilescan;
		adInfo: AdInfo;
		brand?: BrandSummary | null;
	}

	interface ProductAttributes {
		ean: Ean;
		section: string;
		urlSlug: UrlSlug;
		description: Description;
		labelName: LocalizedFiSv;
		marketingName: LocalizedFiSvEn;
		origin: Origin<LocalizedFiSvOptionalEn>;
		measurements: Measurements;
		meta: Meta;
		ingredientId?: string | null;
		pimId: string;
		image: ImageRef;
	}

	interface Description {}

	interface Mobilescan {
		pricing: MobilescanPricing;
		discountLimited: boolean;
		vat: number;
		scaleNumber?: string | null;
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
		storeCampaignId?: string | null;
		discountSource: string;
		reason?: string | null;
	}
}
