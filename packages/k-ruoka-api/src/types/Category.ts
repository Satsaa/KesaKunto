import type { CategoryPath } from "./CategoryPath";
import type { CategorySlug } from "./CategorySlug";

export interface CategoryTreeNode<TName> {
	localizedName: TName;
	slug: CategorySlug;
}

export interface Category<TName> {
	tree: CategoryTreeNode<TName>[];
	localizedName: TName;
	path: CategoryPath;
	order: number;
}
