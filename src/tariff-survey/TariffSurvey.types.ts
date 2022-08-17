import {
	DataSet,
	isDataSet,
	isInterval,
	Interval,
} from "@/SuperCoolServers.types";

export interface TariffInterval extends Interval {
	costPerHour: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isTariffInterval(data: any): data is TariffInterval {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.costPerHour === "number" &&
		isInterval(data)
	);
}

export interface TariffSurveyState extends DataSet {
	dayCost: number;
	dayStart: string;
	nightCost: number;
	nightStart: string;
	units: string;
	wattage: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isTariffSurveyState(data: any): data is TariffSurveyState {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.dayCost === "number" &&
		typeof data.dayStart === "string" &&
		typeof data.nightCost === "number" &&
		typeof data.nightStart === "string" &&
		typeof data.units === "string" &&
		typeof data.wattage === "number" &&
		isDataSet(data) &&
		data.version === 0
	);
}

export function padTariffSurveyState(
	data?: Partial<TariffSurveyState>
): TariffSurveyState {
	return {
		dayCost: 47,
		dayStart: "07:00",
		nightCost: 34,
		nightStart: "00:00",
		units: "GBP",
		wattage: 1000,
		version: 0,
		...data,
	};
}

export interface TariffSchedule {
	intervals: TariffInterval[];
	units: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isTariffSchedule(data: any): data is TariffSchedule {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.units === "string" &&
		data.intervals.every(isTariffInterval)
	);
}
