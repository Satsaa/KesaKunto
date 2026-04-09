export namespace Product {

	export interface Output {
		product: Product;
	}

	export interface Product {
		type: string;
		id: string;
		ean: string;
		baseEan: string;
		localizedName: LocalizedName;
		store: Store;
		availability: DiscountAvailabilityOrAvailability;
		isAvailable: boolean;
		mobilescan: Mobilescan;
		category: Category;
		section: string;
		ingredientId: string;
		productAttributes: ProductAttributes;
		images: string[];
		imageLastUpdate: string;
		popularity: number;
		kind: string;
		isReferenceEan: boolean;
		productLabels: ProductLabels;
		location: Location;
	}

	export interface LocalizedName {
		finnish: string;
		swedish: string;
	}

	export interface Store {
		id: string;
		isLocal: boolean;
	}

	export interface DiscountAvailabilityOrAvailability {
		store: boolean;
		web: boolean;
	}

	export interface Mobilescan {
		pricing: Pricing;
		discountLimited: boolean;
		vat: number;
	}

	export interface Pricing {
		normal: Normal;
		batch: Batch;
		libraryVersion: string;
	}

	export interface Normal {
		unit: string;
		localizedUnit: LocalizedUnitOrCountryOfOriginI18nOrLabelNameOrQualityClassOrMarketingName;
		isApproximate: boolean;
		soldBy: SoldBy;
		price: number;
		unitPrice: UnitPrice;
	}

	export interface LocalizedUnitOrCountryOfOriginI18nOrLabelNameOrQualityClassOrMarketingName {
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

	export interface Batch {
		unit: string;
		localizedUnit: LocalizedUnitOrCountryOfOriginI18nOrLabelNameOrQualityClassOrMarketingName;
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

	export interface Category {
		tree: TreeEntity[];
		localizedName: LocalizedName1;
		path: string;
		order: number;
	}

	export interface TreeEntity {
		localizedName: LocalizedName1;
		slug: string;
	}

	export interface LocalizedName1 {
		finnish: string;
		english: string;
		swedish: string;
	}

	export interface ProductAttributes {
		ean: string;
		meta: Meta;
		image: Image;
		pimId: string;
		origin: Origin;
		section: string;
		urlSlug: string;
		cautions: Cautions;
		labelName: LocalizedUnitOrCountryOfOriginI18nOrLabelNameOrQualityClassOrMarketingName;
		description: DescriptionOrInstructionsOrProductContents;
		ingredientId: string;
		instructions: DescriptionOrInstructionsOrProductContents;
		measurements: Measurements;
		qualityClass: LocalizedUnitOrCountryOfOriginI18nOrLabelNameOrQualityClassOrMarketingName;
		marketingName: LocalizedUnitOrCountryOfOriginI18nOrLabelNameOrQualityClassOrMarketingName;
		responsibility: ResponsibilityEntity[];
		productContents: DescriptionOrInstructionsOrProductContents;
		detailedENumbers: DetailedENumbers;
		dynamicAttributes: unknown[];
		contactInformation: ContactInformation;
		localizedAllergens: LocalizedAllergens;
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

	export interface Origin {
		countryOfOrigin: string;
		countryOfOriginI18n: LocalizedUnitOrCountryOfOriginI18nOrLabelNameOrQualityClassOrMarketingName;
	}

	export interface Cautions {
		storageInstructions: unknown[];
		cautionaryInstructions: unknown[];
	}

	export interface DescriptionOrInstructionsOrProductContents {
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

	export interface ResponsibilityEntity {
		en: string;
		fi: string;
		sv: string;
		name: string;
	}

	export interface DetailedENumbers {
		contains: unknown[];
		freeFrom: unknown[];
		mayContain: unknown[];
	}

	export interface ContactInformation {
		en: EnEntityOrFiEntityOrSvEntity[];
		fi: EnEntityOrFiEntityOrSvEntity[];
		sv: EnEntityOrFiEntityOrSvEntity[];
	}

	export interface EnEntityOrFiEntityOrSvEntity {
		name: string;
		label: string;
		address: string;
	}

	export interface LocalizedAllergens {
		contains: ContainsOrFreeFromOrMayContain;
		freeFrom: ContainsOrFreeFromOrMayContain;
		mayContain: ContainsOrFreeFromOrMayContain;
	}

	export interface ContainsOrFreeFromOrMayContain {
		en: unknown[];
		fi: unknown[];
		sv: unknown[];
	}

	export interface ProductLabels {
		responsibility: Responsibility;
	}

	export interface Responsibility {
		id: string;
		name: UrlOrTextOrNameOrDescription;
		labels: LabelsEntity[];
	}

	export interface UrlOrTextOrNameOrDescription {
		en: string;
		fi: string;
		sv: string;
	}

	export interface LabelsEntity {
		id: string;
		link: Link;
		name: UrlOrTextOrNameOrDescription;
		image: Image1;
		description: UrlOrTextOrNameOrDescription;
	}

	export interface Link {
		url: UrlOrTextOrNameOrDescription;
		text: UrlOrTextOrNameOrDescription;
	}

	export interface Image1 {
		en: EnOrFiOrSv;
		fi: EnOrFiOrSv;
		sv: EnOrFiOrSv;
	}

	export interface EnOrFiOrSv {
		url: string;
		width: number;
		height: number;
	}

	export interface Location {
		ean: string;
		name: string;
		segment: string;
		module: string;
		level: string;
		department: Department;
	}

	export interface Department {
		id: string;
		name: string;
		orderNumber: number;
		zone?: null;
		isPublic: boolean;
	}

}
