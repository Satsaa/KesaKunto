export namespace SearchOffers {

	export interface Output {
		totalHits: number;
		storeId: string;
		results: ResultsEntity[];
		categoryName: LocalizedNameOrLocalizedTitleOrNameOrCategoryName;
		suggestions: Suggestions;
	}

	interface ResultsEntity {
		id: string;
		localizedTitle: LocalizedNameOrLocalizedTitleOrNameOrCategoryName;
		products: ProductsEntity[];
		image: string;
		pricing: Pricing;
		normalPricing: NormalPricing;
		offerType: string;
		campaignId: string;
		score: number;
		offerNameId?: string | null;
	}

	interface LocalizedNameOrLocalizedTitleOrNameOrCategoryName {
		english: string;
		finnish: string;
		swedish: string;
	}

	interface ProductsEntity {
		id: string;
		product: Product;
		score: number;
		type: string;
	}

	interface Product {
		type: string;
		id: string;
		ean: string;
		baseEan: string;
		localizedName: LocalizedName;
		store: Store;
		availability: DiscountAvailabilityOrAvailability;
		isAvailable: boolean;
		category: Category;
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
		ingredientId?: string | null;
	}

	interface LocalizedName {
		english?: string | null;
		finnish: string;
		swedish: string;
	}

	interface Store {
		id: string;
		isLocal: boolean;
	}

	interface DiscountAvailabilityOrAvailability {
		store: boolean;
		web: boolean;
	}

	interface Category {
		tree: TreeEntity[];
		localizedName: LocalizedNameOrLocalizedTitleOrNameOrCategoryName;
		path: string;
		order: number;
	}

	interface TreeEntity {
		localizedName: LocalizedNameOrLocalizedTitleOrNameOrCategoryName;
		slug: string;
	}

	interface ProductAttributes {
		ean: string;
		section: string;
		urlSlug: string;
		description: Description;
		labelName: LabelNameOrLocalizedUnitOrUnitOrMarketingName;
		marketingName: MarketingName;
		origin: Origin;
		measurements: Measurements;
		meta: Meta;
		pimId: string;
		image: Image;
		responsibility: ResponsibilityEntity[];
		ingredientId?: string | null;
		concepts: ConceptsEntity[];
	}

	interface Description {
	}

	interface LabelNameOrLocalizedUnitOrUnitOrMarketingName {
		fi: string;
		sv: string;
	}

	interface MarketingName {
		en?: string | null;
		fi: string;
		sv?: string | null;
	}

	interface Origin {
		countryOfOrigin: string;
		countryOfOriginI18n: CountryOfOriginI18nOrMarketingNameOrLocalizedName;
	}

	interface CountryOfOriginI18nOrMarketingNameOrLocalizedName {
		en: string;
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

	interface ResponsibilityEntity {
		en: string;
		fi: string;
		sv: string;
		name: string;
	}

	interface ConceptsEntity {
		id: string;
		localizedName: CountryOfOriginI18nOrMarketingNameOrLocalizedName;
	}

	interface Mobilescan {
		pricing: Pricing1;
		lowestPriceBeforeDiscount?: LowestPriceBeforeDiscount | null;
		discountLimited: boolean;
		vat: number;
	}

	interface Pricing1 {
		normal: Normal;
		discount?: Discount | null;
		libraryVersion: string;
		batch?: Batch | null;
	}

	interface Normal {
		unit: string;
		localizedUnit: LabelNameOrLocalizedUnitOrUnitOrMarketingName;
		isApproximate: boolean;
		soldBy: SoldBy;
		price: number;
		unitPrice: UnitPrice;
	}

	interface SoldBy {
		kind: string;
	}

	interface UnitPrice {
		value: number;
		unit: string;
		contentSize: number;
	}

	interface Discount {
		unit: string;
		localizedUnit: LabelNameOrLocalizedUnitOrUnitOrMarketingName;
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

	interface Batch {
		unit: string;
		localizedUnit: LabelNameOrLocalizedUnitOrUnitOrMarketingName;
		isApproximate: boolean;
		soldBy: SoldBy;
		price: number;
		discountPercentage: number;
		discountPercentageText: string;
		discountType: string;
		startDate: string;
		endDate: string;
		validNumberOfDaysLeft: number;
		discountAvailability: DiscountAvailabilityOrAvailability;
		unitPrice: UnitPrice;
		amount: number;
		campaignId: string;
		discountSource: string;
	}

	interface LowestPriceBeforeDiscount {
		value: number;
		unit: string;
	}

	interface AdInfo {
		highlightAd: boolean;
		isSponsored: boolean;
	}

	interface Brand {
		id: string;
		name: string;
		slug: string;
		subBrand?: BrandOrSubBrand | null;
	}

	interface BrandOrSubBrand {
		id: string;
		name: string;
		slug: string;
	}

	interface Pricing {
		price: number;
		unit: LabelNameOrLocalizedUnitOrUnitOrMarketingName;
		discountType: string;
		discountAvailability: DiscountAvailabilityOrAvailability;
		discountPercentage?: string | null;
		discountPercentageRange?: PriceRangeOrDiscountPercentageRange | null;
	}

	interface PriceRangeOrDiscountPercentageRange {
		min: number;
		max?: number | null;
	}

	interface NormalPricing {
		price: number;
		unit: LabelNameOrLocalizedUnitOrUnitOrMarketingName;
		priceRange: PriceRangeOrDiscountPercentageRange1;
	}

	interface PriceRangeOrDiscountPercentageRange1 {
		min: number;
		max?: number | null;
	}

	interface Suggestions {
		categories: CategoriesEntity[];
	}

	interface CategoriesEntity {
		name: LocalizedNameOrLocalizedTitleOrNameOrCategoryName;
		slug: string;
		imageUrl: string;
		count: number;
	}

}
