import { SoldByKind } from "./SoldByKind";

export interface SoldBy {
	kind: SoldByKind;
	averageWeight?: number | null;
}
