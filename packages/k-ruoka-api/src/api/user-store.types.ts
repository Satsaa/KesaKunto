import type { BranchCode } from "../types/BranchCode";
import type { BusinessId } from "../types/BusinessId";
import type { GeoPoint } from "../types/GeoPoint";
import type { IsoDateString } from "../types/IsoDateString";
import type { LocalizedFinnish } from "../types/LocalizedFinnish";
import type { LocalizedFinnishEnglishSwedish } from "../types/LocalizedFinnishEnglishSwedish";
import type { OpenDayWindow } from "../types/OpenDayWindow";
import type { StoreId } from "../types/StoreId";
import type { StoreSlug } from "../types/StoreSlug";
import type { StringUrl } from "../types/StringUrl";
import type { UserStore as UserStoreReference } from "./api-references/user-store.reference";

export namespace UserStore {
	export interface Output {
		selectedStore: SelectedStore;
	}

	export type ReferenceOutput = UserStoreReference.Output;

	interface SelectedStore {
		id: StoreId;
		name: string;
		branchCode: BranchCode;
		chain: string;
		chainAbbreviation: string;
		chainName: string;
		shortName: string;
		shortestName: string;
		slug: StoreSlug;
		legacySlugs: unknown[];
		location: string;
		deliveryMethods: string[];
		hasPickup: boolean;
		hasPickupBox: boolean;
		hasHomeDelivery: boolean;
		hasExpressDelivery: boolean;
		expressDeliveryProvider?: null;
		isWebStore: boolean;
		geo: GeoPoint;
		retailerImage: StringUrl;
		openNextTwoDays: OpenDayWindow[];
		businessId: BusinessId;
		offerBrochure: OfferBrochure;
		details: Details;
		notifications: NotificationsEntity[];
		files: unknown[];
		paymentMethods: PaymentMethods;
		ePaymentsAsHiddenFeature: boolean;
		allowAlcoholPickup: boolean;
		restaurants: unknown[];
	}

	interface OfferBrochure {
		pageUrl: StringUrl;
		chainPdfUrl: StringUrl;
		storePdfUrl?: null;
	}

	interface Details {
		name: string;
		shortName: string;
		chainId: string;
		chainLogo: StringUrl;
		shopkeeper: Shopkeeper;
		streetAddress: string;
		postalCode: string;
		addressLocality: string;
		facebookUrl: StringUrl;
		rawOpeningHours: RawOpeningHoursEntity[];
		serviceOpeningHours: ServiceOpeningHours;
		localizedPhone: LocalizedPhone;
		localizedServicePhone?: null;
		localizedWebStorePhone?: null;
		email?: null;
		customUiContent: CustomUiContent;
		productLifts: string[];
		storeServices: StoreServicesEntity[];
		storeNews: unknown[];
		socialMedia: SocialMedia;
		deliveryPricingRanges: DeliveryPricingRanges;
		jobApplication: JobApplication;
		privacyPolicies: PrivacyPolicies;
		cacheLastUpdated: string;
		storeImages: ImageOrStoreImagesEntity[];
	}

	interface Shopkeeper {
		title: LocalizedFinnish;
		signature: LocalizedFinnish;
		greeting?: null;
		image: ImageOrStoreImagesEntity;
	}

	interface ImageOrStoreImagesEntity {
		url: StringUrl;
	}

	interface RawOpeningHoursEntity {
		"@type": string;
		dayOfWeek?: string | null;
		opens: string;
		closes: string;
		validFrom: IsoDateString;
		validThrough: IsoDateString;
		description: string;
	}

	interface ServiceOpeningHours {
		openingHoursSpecs: OpeningHoursSpecs;
		dailyOpeningHours: DailyOpeningHoursEntity[];
	}

	interface OpeningHoursSpecs {
		normalOpeningHoursSpecs: NormalOpeningHoursSpecsEntity[];
		specialOpeningHoursSpecs: SpecialOpeningHoursSpecsEntity[];
	}

	interface NormalOpeningHoursSpecsEntity {
		id: number;
		name: LocalizedFinnish;
		isPrimary: boolean;
		openingHoursPeriods: OpeningHoursPeriodsEntity[];
	}

	interface OpeningHoursPeriodsEntity {
		id: number;
		name: LocalizedFinnish;
		validFrom?: null;
		validTo?: null;
		isDefault: boolean;
		openingHours: OpeningHoursEntity[];
	}

	interface OpeningHoursEntity {
		dayOfWeek: number;
		description?: null;
		opens?: string | null;
		closes?: string | null;
		openAllDay?: null;
		closedAllDay?: boolean | null;
	}

	interface SpecialOpeningHoursSpecsEntity {
		id: number;
		name: LocalizedFinnishEnglishSwedish;
		date: IsoDateString;
		openingHours: OpeningHoursEntity1[];
	}

	interface OpeningHoursEntity1 {
		serviceId: number;
		serviceName: LocalizedFinnish;
		isPrimary: boolean;
		opens?: string | null;
		closes?: string | null;
		openAllDay?: null;
		closedAllDay?: boolean | null;
	}

	interface DailyOpeningHoursEntity {
		serviceId: number;
		serviceName: LocalizedFinnish;
		isPrimary: boolean;
		openingHours: OpeningHoursEntity2[];
	}

	interface OpeningHoursEntity2 {
		date: IsoDateString;
		description: Description;
		opens?: string | null;
		closes?: string | null;
		openAllDay?: null;
		closedAllDay?: boolean | null;
	}

	interface Description {
		finnish: string;
		english?: string | null;
		swedish?: string | null;
	}

	interface LocalizedPhone {
		number: LocalizedFinnish;
		info: LocalizedFinnish;
		pricing: LocalizedFinnish;
	}

	interface CustomUiContent {
		"ui.packagingPriceInfo": string;
		"ui.packagingPriceInfo.fi": string;
		"ui.packagingPriceInfo.sv": string;
	}

	interface StoreServicesEntity {
		id: number;
		name: string;
		imageUrl: StringUrl;
	}

	interface SocialMedia {
		embedded: Embedded;
		links: Links;
	}

	interface Embedded {
		facebook: StringUrl;
		youtube?: null;
	}

	interface Links {
		facebook: StringUrl;
		instagram: StringUrl;
		youtube?: null;
		twitter?: null;
		tiktok?: null;
	}

	interface DeliveryPricingRanges {
		pickup: PickupOrPickupBoxOrExpressDelivery;
		pickupBox: PickupOrPickupBoxOrExpressDelivery;
		homeDelivery: HomeDelivery;
		expressDelivery: PickupOrPickupBoxOrExpressDelivery;
	}

	interface PickupOrPickupBoxOrExpressDelivery {
		count: number;
	}

	interface HomeDelivery {
		min: number;
		count: number;
		max: number;
	}

	interface JobApplication {
		hideForm: boolean;
		hideInfoText: boolean;
		infoText?: null;
		hideExternalLink: boolean;
		externalLinkUrl?: null;
		externalLinkDescription?: null;
	}

	interface PrivacyPolicies {
		webStore?: null;
		jobApplication?: null;
	}

	interface NotificationsEntity {
		type: string;
		message: string;
		timestamp: string;
	}

	interface PaymentMethods {
		pickup: unknown[];
		pickupBox: unknown[];
		homeDelivery: string[];
		expressDelivery: string[];
	}
}
