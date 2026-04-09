import type { Availability } from "../types/Availability";
import type { CampaignId } from "../types/CampaignId";
import type { Category } from "../types/Category";
import { DiscountType } from "../types/DiscountType";
import type { Ean } from "../types/Ean";
import type { ImageRef } from "../types/ImageRef";
import type { IsoDateTimeString } from "../types/IsoDateTimeString";
import type { LocalizedFiSv } from "../types/LocalizedFiSv";
import type { LocalizedFinnishEnglishSwedish } from "../types/LocalizedFinnishEnglishSwedish";
import type { LocalizedFinnishSwedish } from "../types/LocalizedFinnishSwedish";
import type { Measurements } from "../types/Measurements";
import type { Meta } from "../types/Meta";
import type { Origin } from "../types/Origin";
import type { SoldBy } from "../types/SoldBy";
import type { StoreRef } from "../types/StoreRef";
import type { StringUrl } from "../types/StringUrl";
import type { UnitPrice } from "../types/UnitPrice";
import type { UrlSlug } from "../types/UrlSlug";
import type { Product as ProductReference } from "./api-references/product.reference";

export namespace Product {
	export interface Output {
		product: ProductEntity;
	}

	export type ReferenceOutput = ProductReference.Output;

	export interface ProductEntity {
		type: string;
		id: Ean;
		ean: Ean;
		baseEan: Ean;
		localizedName: LocalizedFinnishSwedish;
		store: StoreRef;
		availability: Availability;
		isAvailable: boolean;
		mobilescan: Mobilescan;
		category: Category<LocalizedFinnishEnglishSwedish>;
		section: string;
		ingredientId: string;
		productAttributes: ProductAttributes;
		images: StringUrl[];
		imageLastUpdate: IsoDateTimeString;
		popularity: number;
		kind: string;
		isReferenceEan: boolean;
		productLabels: ProductLabels;
		location: Location;
	}

	interface Mobilescan {
		pricing: Pricing;
		discountLimited: boolean;
		vat: number;
	}

	interface Pricing {
		normal: Normal;
		batch: Batch;
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

	interface ProductAttributes {
		ean: Ean;
		meta: Meta;
		image: ImageRef;
		pimId: string;
		origin: Origin<LocalizedFiSv>;
		section: string;
		urlSlug: UrlSlug;
		cautions: Cautions;
		labelName: LocalizedFiSv;
		description: Description;
		ingredientId: string;
		instructions: Description;
		measurements: Measurements;
		qualityClass: LocalizedFiSv;
		marketingName: LocalizedFiSv;
		responsibility: ResponsibilityEntity[];
		productContents: Description;
		detailedENumbers: DetailedENumbers;
		dynamicAttributes: unknown[];
		contactInformation: ContactInformation;
		localizedAllergens: LocalizedAllergens;
	}

	interface Cautions {
		storageInstructions: unknown[];
		cautionaryInstructions: unknown[];
	}

	interface Description {}

	interface ResponsibilityEntity {
		en: string;
		fi: string;
		sv: string;
		name: string;
	}

	interface DetailedENumbers {
		contains: unknown[];
		freeFrom: unknown[];
		mayContain: unknown[];
	}

	interface ContactInformation {
		en: ContactInformationEntry[];
		fi: ContactInformationEntry[];
		sv: ContactInformationEntry[];
	}

	interface ContactInformationEntry {
		name: string;
		label: string;
		address: string;
	}

	interface LocalizedAllergens {
		contains: LocalizedUnknownLists;
		freeFrom: LocalizedUnknownLists;
		mayContain: LocalizedUnknownLists;
	}

	interface LocalizedUnknownLists {
		en: unknown[];
		fi: unknown[];
		sv: unknown[];
	}

	interface ProductLabels {
		responsibility: Responsibility;
	}

	interface Responsibility {
		id: string;
		name: LocalizedFiSvEn;
		labels: Label[];
	}

	interface LocalizedFiSvEn {
		en: string;
		fi: string;
		sv: string;
	}

	interface Label {
		id: string;
		link: Link;
		name: LocalizedFiSvEn;
		image: LabelImage;
		description: LocalizedFiSvEn;
	}

	interface Link {
		url: LocalizedFiSvEn;
		text: LocalizedFiSvEn;
	}

	interface LabelImage {
		en: SizedImage;
		fi: SizedImage;
		sv: SizedImage;
	}

	interface SizedImage {
		url: StringUrl;
		width: number;
		height: number;
	}

	interface Location {
		ean: Ean;
		name: string;
		segment: string;
		module: string;
		level: string;
		department: Department;
	}

	interface Department {
		id: string;
		name: string;
		orderNumber: number;
		zone?: null;
		isPublic: boolean;
	}
}
