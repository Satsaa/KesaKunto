import type { IsoDateString } from "./IsoDateString";

export interface OpenDayWindow {
	opens: string;
	closes: string;
	date: IsoDateString;
	closedAllDay: boolean;
	notAvailable: boolean;
}
