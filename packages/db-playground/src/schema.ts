import { type Generated } from "kysely-is-an-orm";

export interface MarketTable {
	id: Generated<number>;
	name: string;
	location: string;
	active: boolean;
	created_at: Generated<string>;
}

export interface SellerTable {
	id: Generated<number>;
	market_id: number;
	name: string;
	booth_number: string;
	created_at: Generated<string>;
}

export interface ItemTable {
	id: Generated<number>;
	seller_id: number;
	name: string;
	price: number;
}

export interface MarketTagTable {
	id: Generated<number>;
	name: string;
}

export interface MarketTagJoinTable {
	market_id: number;
	tag_id: number;
}

export interface Database {
	markets: MarketTable;
	sellers: SellerTable;
	items: ItemTable;
	market_tags: MarketTagTable;
	market_tag_joins: MarketTagJoinTable;
}
