export interface Interval {
	endTime: number;
	startTime: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function isInterval(data: any): data is Interval {
	return typeof data.endTime === "number" && typeof data.startTime === "number";
}

export interface ThermostatInterval extends Interval {
	thermostatSetting: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isThermostatInterval(data: any): data is ThermostatInterval {
	return typeof data.thermostatSetting === "number" && isInterval(data);
}

export interface ThermalInterval extends ThermostatInterval {
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
		isThermostatInterval(data)
	);
}

export interface DataSet {
	version: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isDataSet(data: any): data is DataSet {
	return typeof data.version === "number";
}

export interface ThermalProperties extends DataSet {
	baseloadDutyCycle: number;
	temperatureChangeVelocity: number;
	maximumThermostat: number;
	minimumThermostat: number;
	normalThermostat: number;
}
