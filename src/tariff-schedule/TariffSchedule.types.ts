import {
	DataSet,
	isDataSet,
	isInterval,
	Interval,
} from "@/SuperCoolServers.types";

export interface TariffInterval extends Interval {
	costPerHour: number;
	units: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isTariffInterval(data: any): data is TariffInterval {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.costPerHour === "number" &&
		typeof data.units === "string" &&
		isInterval(data)
	);
}

export interface TariffScheduleState extends DataSet {
	dayCost: number;
	dayStart: string;
	nightCost: number;
	nightStart: string;
	units: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isTariffScheduleState(data: any): data is TariffScheduleState {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.dayCost === "number" &&
		typeof data.dayStart === "string" &&
		typeof data.nightCost === "number" &&
		typeof data.nightStart === "string" &&
		typeof data.units === "string" &&
		isDataSet(data) &&
		data.version === 0
	);
}

export function padTariffScheduleState(
	data?: Partial<TariffScheduleState>
): TariffScheduleState {
	return {
		dayCost: 47,
		dayStart: "07:00",
		nightCost: 34,
		nightStart: "00:00",
		units: "GBP",
		version: 0,
		...data,
	};
}
