
export namespace OfferCategory {
	export interface Output {
		totalHits: number;
		name: LocalizedNameOrLocalizedTitleOrName;
		offers: OffersEntity[];
		paginatedOfferIds: unknown[];
	}

	interface LocalizedNameOrLocalizedTitleOrName {
		finnish: string;
		swedish: string;
		english: string;
	}

	interface OffersEntity {
		id: string;
		localizedTitle: LocalizedNameOrLocalizedTitleOrName;
		image: string;
		pricing: Pricing;
		normalPricing: NormalPricing;
		offerType: string;
		campaignId: string;
		product?: Product | null;
		offerNameId?: string | null;
	}

	interface Pricing {
		price: number;
		unit: UnitOrLabelNameOrLocalizedUnitOrCountryOfOriginI18n;
		discountType: string;
		discountAvailability: DiscountAvailabilityOrAvailability;
		discountPercentage?: string | null;
		discountPercentageRange?: PriceRangeOrDiscountPercentageRange | null;
	}

	interface UnitOrLabelNameOrLocalizedUnitOrCountryOfOriginI18n {
		fi: string;
		sv: string;
	}

	interface DiscountAvailabilityOrAvailability {
		web: boolean;
		store: boolean;
	}

	interface PriceRangeOrDiscountPercentageRange {
		min: number;
	}

	interface NormalPricing {
		price: number;
		unit: UnitOrLabelNameOrLocalizedUnitOrCountryOfOriginI18n;
		priceRange: PriceRangeOrDiscountPercentageRange1;
	}

	interface PriceRangeOrDiscountPercentageRange1 {
		min: number;
	}

	interface Product {
		id: string;
		product: Product1;
		score: number;
		type: string;
	}

	interface Product1 {
		type: string;
		id: string;
		ean: string;
		baseEan: string;
		localizedName: LocalizedNameOrLocalizedTitleOrName;
		store: Store;
		availability: DiscountAvailabilityOrAvailability;
		isAvailable: boolean;
		category: Category;
		ingredientId?: string | null;
		productAttributes: ProductAttributes;
		images: string[];
		imageLastUpdate: string;
		popularity: number;
		kind: string;
		isReferenceEan: boolean;
		section: string;
		mobilescan: Mobilescan;
		adInfo: AdInfo;
		brand?: Brand | null;
	}

	interface Store {
		id: string;
		isLocal: boolean;
	}

	interface Category {
		tree: TreeEntity[];
		localizedName: LocalizedNameOrLocalizedTitleOrName;
		path: string;
		order: number;
	}

	interface TreeEntity {
		localizedName: LocalizedNameOrLocalizedTitleOrName;
		slug: string;
	}

	interface ProductAttributes {
		ean: string;
		section: string;
		urlSlug: string;
		description: Description;
		labelName: UnitOrLabelNameOrLocalizedUnitOrCountryOfOriginI18n;
		marketingName: CountryOfOriginI18nOrMarketingName;
		origin: Origin;
		measurements: Measurements;
		meta: Meta;
		ingredientId?: string | null;
		pimId: string;
		image: Image;
	}

	interface Description {
	}

	interface CountryOfOriginI18nOrMarketingName {
		en: string;
		fi: string;
		sv: string;
	}

	interface Origin {
		countryOfOrigin: string;
		countryOfOriginI18n: CountryOfOriginI18n;
	}

	interface CountryOfOriginI18n {
		en?: string | null;
		fi: string;
		sv: string;
	}

	interface Measurements {
		width: number;
		height: number;
		length: number;
		netWeight: number;
		contentSize: number;
		contentUnit: string;
		grossWeight: number;
		averageWeight?: number | null;
	}

	interface Meta {
		source: string;
		isAlcohol: boolean;
		isUtility: boolean;
		alcoholStatus: string;
		deprecatedEan: boolean;
		hiddenInRecipe: boolean;
		isInternalCode: boolean;
		canBeShownInWeb: boolean;
	}

	interface Image {
		url: string;
	}

	interface Mobilescan {
		pricing: Pricing1;
		discountLimited: boolean;
		vat: number;
		scaleNumber?: string | null;
	}

	interface Pricing1 {
		normal: Normal;
		discount: Discount;
		libraryVersion: string;
	}

	interface Normal {
		unit: string;
		localizedUnit: UnitOrLabelNameOrLocalizedUnitOrCountryOfOriginI18n;
		isApproximate: boolean;
		soldBy: SoldBy;
		price: number;
		unitPrice: UnitPrice;
	}

	interface SoldBy {
		kind: string;
		averageWeight?: number | null;
	}

	interface UnitPrice {
		value: number;
		unit: string;
		contentSize: number;
	}

	interface Discount {
		unit: string;
		localizedUnit: UnitOrLabelNameOrLocalizedUnitOrCountryOfOriginI18n;
		isApproximate: boolean;
		soldBy: SoldBy;
		price: number;
		unitPrice: UnitPrice;
		discountPercentage: number;
		discountPercentageText: string;
		discountType: string;
		startDate: string;
		endDate: string;
		validNumberOfDaysLeft: number;
		discountAvailability: DiscountAvailabilityOrAvailability;
		campaignId: string;
		storeCampaignId?: string | null;
		discountSource: string;
		reason?: string | null;
	}

	interface AdInfo {
		highlightAd: boolean;
		isSponsored: boolean;
	}

	interface Brand {
		id: string;
		name: string;
		slug: string;
	}

}
