export interface Interval {
	endTime: Date;
	startTime: Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isInterval(data: any): data is Interval {
	return data.endTime instanceof Date && data.startTime instanceof Date;
}

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

export interface ThermalInterval extends Interval {
	startTemperature: number;
	endTemperature: number;
	dutyCycle: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isThermalInterval(data: any): data is ThermalInterval {
	return (
		typeof data.startTemperature === "number" &&
		typeof data.endTemperature === "number" &&
		typeof data.dutyCycle === "number" &&
		isInterval(data)
	);
}

export interface ThermalObservation extends ThermalInterval {
	initialObservation: boolean;
	transitionTime?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isThermalObservation(data: any): data is ThermalObservation {
	return (
		typeof data.initialObservation === "boolean" &&
		(typeof data.transitionTime === "undefined" ||
			data.transitionTime instanceof Date) &&
		isThermalInterval(data)
	);
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

export interface TangibleThermalProperties {
	baseloadDutyCycle: number;
	normalThermostat: number;
	temperatureChangeVelocity: number;
}

export function isTangibleThermalProperties(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	data: any
): data is TangibleThermalProperties {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.baseloadDutyCycle === "number" &&
		typeof data.normalThermostat === "number" &&
		typeof data.temperatureChangeVelocity === "number"
	);
}

export interface ThermalProperties extends TangibleThermalProperties {
	maximumThermostat: number;
	minimumThermostat: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isThermalProperties(data: any): data is ThermalProperties {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.maximumThermostat === "number" &&
		typeof data.minimumThermostat === "number" &&
		isTangibleThermalProperties(data)
	);
}
