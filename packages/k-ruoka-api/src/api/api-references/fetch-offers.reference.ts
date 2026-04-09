export namespace FetchOffers {
	export interface Output {
		storeId: string;
		offers: OffersEntity[];
	}

	export interface OffersEntity {
		id: string;
		localizedTitle: LocalizedNameOrLocalizedTitle;
		products: ProductsEntity[];
		image: string;
		pricing: Pricing;
		normalPricing: NormalPricing;
		offerType: string;
		campaignId: string;
		offerNameId: string;
	}

	export interface LocalizedNameOrLocalizedTitle {
		english: string;
		finnish: string;
		swedish: string;
	}

	export interface ProductsEntity {
		id: string;
		product: Product;
		score: number;
		type: string;
	}

	export interface Product {
		type: string;
		id: string;
		ean: string;
		baseEan: string;
		localizedName: LocalizedNameOrLocalizedTitle;
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
		brand: Brand;
	}

	export interface Store {
		id: string;
		isLocal: boolean;
	}

	export interface DiscountAvailabilityOrAvailability {
		store: boolean;
		web: boolean;
	}

	export interface Category {
		tree: TreeEntity[];
		localizedName: LocalizedNameOrLocalizedTitle;
		path: string;
		order: number;
	}

	export interface TreeEntity {
		localizedName: LocalizedNameOrLocalizedTitle;
		slug: string;
	}

	export interface ProductAttributes {
		ean: string;
		section: string;
		urlSlug: string;
		description: Description;
		labelName: LabelName;
		marketingName: CountryOfOriginI18nOrMarketingNameOrSubColourOrLabelName;
		origin: Origin;
		measurements: Measurements;
		meta: Meta;
		pimId: string;
		image: Image;
		subColour?: CountryOfOriginI18nOrMarketingNameOrSubColourOrLabelName1 | null;
	}

	export interface Description {
	}

	export interface LabelName {
		fi: string;
		sv: string;
		en?: string | null;
	}

	export interface CountryOfOriginI18nOrMarketingNameOrSubColourOrLabelName {
		en: string;
		fi: string;
		sv: string;
	}

	export interface Origin {
		countryOfOrigin: string;
		countryOfOriginI18n: CountryOfOriginI18nOrMarketingNameOrSubColourOrLabelName;
	}

	export interface Measurements {
		width: number;
		height: number;
		length: number;
		netWeight: number;
		contentSize: number;
		contentUnit: string;
		grossWeight: number;
	}

	export interface Meta {
		source: string;
		isAlcohol: boolean;
		isUtility: boolean;
		alcoholStatus: string;
		deprecatedEan: boolean;
		hiddenInRecipe: boolean;
		isInternalCode: boolean;
		canBeShownInWeb: boolean;
	}

	export interface Image {
		url: string;
	}

	export interface CountryOfOriginI18nOrMarketingNameOrSubColourOrLabelName1 {
		en: string;
		fi: string;
		sv: string;
	}

	export interface Mobilescan {
		pricing: Pricing1;
		discountLimited: boolean;
		vat: number;
	}

	export interface Pricing1 {
		normal: Normal;
		discount: Discount;
		libraryVersion: string;
	}

	export interface Normal {
		unit: string;
		localizedUnit: LabelNameOrLocalizedUnitOrUnit;
		isApproximate: boolean;
		soldBy: SoldBy;
		price: number;
		unitPrice: UnitPrice;
	}

	export interface LabelNameOrLocalizedUnitOrUnit {
		fi: string;
		sv: string;
	}

	export interface SoldBy {
		kind: string;
	}

	export interface UnitPrice {
		value: number;
		unit: string;
		contentSize: number;
	}

	export interface Discount {
		unit: string;
		localizedUnit: LabelNameOrLocalizedUnitOrUnit;
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
		discountSource: string;
	}

	export interface AdInfo {
		highlightAd: boolean;
		isSponsored: boolean;
	}

	export interface Brand {
		id: string;
		name: string;
		slug: string;
		subBrand: SubBrand;
	}

	export interface SubBrand {
		id: string;
		name: string;
		slug: string;
	}

	export interface Pricing {
		unit: LabelNameOrLocalizedUnitOrUnit;
		discountPercentage: string;
		discountPercentageRange: DiscountPercentageRange;
		discountType: string;
		discountAvailability: DiscountAvailabilityOrAvailability;
	}

	export interface DiscountPercentageRange {
		min: number;
	}

	export interface NormalPricing {
		price: number;
		unit: LabelNameOrLocalizedUnitOrUnit;
		priceRange: PriceRange;
	}

	export interface PriceRange {
		min: number;
		max: number;
	}

}
