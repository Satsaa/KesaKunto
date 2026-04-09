export namespace StoresSearch {
	export interface Output {
		results: ResultsEntity[];
		totalHits: number;
		queryId: string;
	}

	interface ResultsEntity {
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
		deliveryMethods?: (string | null)[] | null;
		hasPickup: boolean;
		hasPickupBox: boolean;
		hasHomeDelivery: boolean;
		hasExpressDelivery: boolean;
		isWebStore: boolean;
		geo: Geo;
		retailerImage?: string | null;
		openNextTwoDays: OpenNextTwoDaysEntity[];
		businessId: string;
		offerBrochure: OfferBrochure;
		distanceToUser: number;
		expressDeliveryProvider?: string | null;
		nextFreePickupBox?: string | null;
		nextFreePickup?: string | null;
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
		chainPdfUrl?: string | null;
		storePdfUrl?: null;
	}

}
