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

