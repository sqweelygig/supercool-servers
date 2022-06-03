export interface Interval {
	endTime: Date;
	startTime: Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isInterval(data: any): data is Interval {
	return data.endTime instanceof Date && data.startTime instanceof Date;
}

export interface ThermostatInterval extends Interval {
	thermostatSetting: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isThermostatInterval(data: any): data is ThermostatInterval {
	return typeof data.thermostatSetting === "number" && isInterval(data);
}

export interface DataSet extends Record<string, unknown> {
	version: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isDataSet(data: any): data is DataSet {
	return typeof data.version === "number";
}

import {
	TariffSchedule,
	isTariffSchedule,
} from "./tariff-survey/TariffSurvey.types";
import {
	ThermalProperties,
	isThermalProperties,
} from "./thermal-survey/ThermalSurvey.types";

export enum Phases {
	Introduction = "introduction",
	Survey = "survey",
	Tariff = "tariff",
	Chart = "chart",
}

export interface SuperCoolServersState extends DataSet {
	phase: Phases;
	tariffSchedule?: TariffSchedule;
	thermalProperties?: ThermalProperties;
}

export function isSuperCoolServersState(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	data: any
): data is SuperCoolServersState {
	const tariffs = data.tariffSchedule;
	const thermals = data.thermalProperties;
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.phase === "string" &&
		Object.values(Phases).includes(data.phase) &&
		(tariffs === undefined || isTariffSchedule(tariffs)) &&
		(thermals === undefined || isThermalProperties(thermals)) &&
		isDataSet(data) &&
		data.version === 0
	);
}

export function padSuperCoolServersState(
	data: Partial<SuperCoolServersState>
): SuperCoolServersState {
	return {
		phase: Phases.Introduction,
		version: 0,
		...data,
		tariffSchedule: data.tariffSchedule && {
			units: data.tariffSchedule.units,
			intervals: data.tariffSchedule.intervals.map((value) => {
				return {
					costPerHour: value.costPerHour,
					startTime: new Date(value.startTime),
					endTime: new Date(value.endTime),
				};
			}),
		},
	};
}
