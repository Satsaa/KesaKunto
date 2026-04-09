import type { BranchCode } from "../types/BranchCode";
import type { BusinessId } from "../types/BusinessId";
import type { GeoPoint } from "../types/GeoPoint";
import type { OpenDayWindow } from "../types/OpenDayWindow";
import type { StoreId } from "../types/StoreId";
import type { StoreSlug } from "../types/StoreSlug";
import type { StringUrl } from "../types/StringUrl";
import type { StoresSearch as StoresSearchReference } from "./api-references/stores-search.reference";

export namespace StoresSearch {
	export interface Output {
		results: StoreResult[];
		totalHits: number;
		queryId: string;
	}

	export type ReferenceOutput = StoresSearchReference.Output;

	interface StoreResult {
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
		deliveryMethods?: (string | null)[] | null;
		hasPickup: boolean;
		hasPickupBox: boolean;
		hasHomeDelivery: boolean;
		hasExpressDelivery: boolean;
		isWebStore: boolean;
		geo: GeoPoint;
		retailerImage?: StringUrl | null;
		openNextTwoDays: OpenDayWindow[];
		businessId: BusinessId;
		offerBrochure: OfferBrochure;
		distanceToUser: number;
		expressDeliveryProvider?: string | null;
		nextFreePickupBox?: string | null;
		nextFreePickup?: string | null;
	}

	interface OfferBrochure {
		pageUrl: StringUrl;
		chainPdfUrl?: StringUrl | null;
		storePdfUrl?: null;
	}
}
