export namespace OfferCategories {

	export interface Output {
		offerCategories: OfferCategoriesEntity[];
	}

	interface OfferCategoriesEntity {
		slug: string;
		count: number;
		name: Name;
	}

	interface Name {
		finnish: string;
		swedish: string;
		english: string;
	}

}
