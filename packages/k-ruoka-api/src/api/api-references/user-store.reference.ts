export namespace UserStore {

	export interface Output {
		selectedStore: SelectedStore;
	}

	interface SelectedStore {
		id: string;
		name: string;
		branchCode: number;
		chain: string;
		chainAbbreviation: string;
		chainName: string;
		shortName: string;
		shortestName: string;
		slug: string;
		legacySlugs: unknown[];
		location: string;
		deliveryMethods: string[];
		hasPickup: boolean;
		hasPickupBox: boolean;
		hasHomeDelivery: boolean;
		hasExpressDelivery: boolean;
		expressDeliveryProvider?: null;
		isWebStore: boolean;
		geo: Geo;
		retailerImage: string;
		openNextTwoDays: OpenNextTwoDaysEntity[];
		businessId: string;
		offerBrochure: OfferBrochure;
		details: Details;
		notifications: NotificationsEntity[];
		files: unknown[];
		paymentMethods: PaymentMethods;
		ePaymentsAsHiddenFeature: boolean;
		allowAlcoholPickup: boolean;
		restaurants: unknown[];
	}

	interface Geo {
		latitude: number;
		longitude: number;
	}

	interface OpenNextTwoDaysEntity {
		opens: string;
		closes: string;
		date: string;
		closedAllDay: boolean;
		notAvailable: boolean;
	}

	interface OfferBrochure {
		pageUrl: string;
		chainPdfUrl: string;
		storePdfUrl?: null;
	}

	interface Details {
		name: string;
		shortName: string;
		chainId: string;
		chainLogo: string;
		shopkeeper: Shopkeeper;
		streetAddress: string;
		postalCode: string;
		addressLocality: string;
		facebookUrl: string;
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
		title: TitleOrSignatureOrNameOrServiceNameOrDescriptionOrNumberOrInfoOrPricing;
		signature: TitleOrSignatureOrNameOrServiceNameOrDescriptionOrNumberOrInfoOrPricing;
		greeting?: null;
		image: ImageOrStoreImagesEntity;
	}

	interface TitleOrSignatureOrNameOrServiceNameOrDescriptionOrNumberOrInfoOrPricing {
		finnish: string;
	}

	interface ImageOrStoreImagesEntity {
		url: string;
	}

	interface RawOpeningHoursEntity {
		"@type": string;
		dayOfWeek?: string | null;
		opens: string;
		closes: string;
		validFrom: string;
		validThrough: string;
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
		name: TitleOrSignatureOrNameOrServiceNameOrDescriptionOrNumberOrInfoOrPricing;
		isPrimary: boolean;
		openingHoursPeriods: OpeningHoursPeriodsEntity[];
	}

	interface OpeningHoursPeriodsEntity {
		id: number;
		name: TitleOrSignatureOrNameOrServiceNameOrDescriptionOrNumberOrInfoOrPricing;
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
		name: NameOrDescription;
		date: string;
		openingHours: OpeningHoursEntity1[];
	}

	interface NameOrDescription {
		finnish: string;
		english: string;
		swedish: string;
	}

	interface OpeningHoursEntity1 {
		serviceId: number;
		serviceName: TitleOrSignatureOrNameOrServiceNameOrDescriptionOrNumberOrInfoOrPricing;
		isPrimary: boolean;
		opens?: string | null;
		closes?: string | null;
		openAllDay?: null;
		closedAllDay?: boolean | null;
	}

	interface DailyOpeningHoursEntity {
		serviceId: number;
		serviceName: TitleOrSignatureOrNameOrServiceNameOrDescriptionOrNumberOrInfoOrPricing;
		isPrimary: boolean;
		openingHours: OpeningHoursEntity2[];
	}

	interface OpeningHoursEntity2 {
		date: string;
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
		number: TitleOrSignatureOrNameOrServiceNameOrDescriptionOrNumberOrInfoOrPricing;
		info: TitleOrSignatureOrNameOrServiceNameOrDescriptionOrNumberOrInfoOrPricing;
		pricing: TitleOrSignatureOrNameOrServiceNameOrDescriptionOrNumberOrInfoOrPricing;
	}

	interface CustomUiContent {
		"ui.packagingPriceInfo": string;
		"ui.packagingPriceInfo.fi": string;
		"ui.packagingPriceInfo.sv": string;
	}

	interface StoreServicesEntity {
		id: number;
		name: string;
		imageUrl: string;
	}

	interface SocialMedia {
		embedded: Embedded;
		links: Links;
	}

	interface Embedded {
		facebook: string;
		youtube?: null;
	}

	interface Links {
		facebook: string;
		instagram: string;
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
