export interface ScoredProductReference<TProduct> {
	id: string;
	product: TProduct;
	score: number;
	type: string;
}
