export namespace ProductSets {

	export interface Output {
		id: string;
		title: TitleOrDescription;
		description: TitleOrDescription;
		imageUrl: string;
		products: string[];
		urlSlug: string;
		type: string;
		upsell: boolean;
		productOrder: string;
		offerTagId?: null;
	}

	interface TitleOrDescription {
		finnish: string;
		english: string;
		swedish: string;
	}

}
