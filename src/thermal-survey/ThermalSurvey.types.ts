import {
	DataSet,
	isDataSet,
	Interval,
	isInterval,
} from "@/SuperCoolServers.types";

export enum SurveyPhases {
	Introduction = "thermal survey",
	Normal = "normal",
	Cooling = "cooling",
	Cooler = "cooler",
	Resting = "resting",
	Warmer = "warmer",
	Finish = "finish",
}

export interface ThermalSurveyState extends DataSet {
	externalTemperature: number;
	maximumThermostat: number;
	minimumThermostat: number;
	normalThermostat: number;
	observations: Array<Partial<ThermalObservation>>;
	phase: SurveyPhases;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isThermalSurveyState(data: any): data is ThermalSurveyState {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.externalTemperature === "number" &&
		typeof data.maximumThermostat === "number" &&
		typeof data.minimumThermostat === "number" &&
		typeof data.normalThermostat === "number" &&
		Array.isArray(data.observations) &&
		data.observations.every(isThermalInterval) &&
		Object.values(SurveyPhases).includes(data.phase) &&
		isDataSet(data) &&
		data.version === 0
	);
}

export function padThermalSurveyState(
	data?: Partial<ThermalSurveyState>
): ThermalSurveyState {
	const dateified = (data?.observations || []).map((observation) => {
		const transitionTime = observation.transitionTime;
		return {
			...observation,
			endTime: observation.endTime && new Date(observation.endTime),
			startTime: observation.startTime && new Date(observation.startTime),
			transitionTime: transitionTime && new Date(transitionTime),
		};
	});
	const filteredObservations = dateified.filter(isThermalInterval);
	return {
		externalTemperature: 20,
		maximumThermostat: 20,
		minimumThermostat: 14,
		normalThermostat: 18,
		phase: SurveyPhases.Introduction,
		version: 0,
		...data,
		observations: filteredObservations,
	};
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
	const baseloadDutyCycle = data.baseloadDutyCycle;
	const rateOfChange = data.temperatureChangeVelocity;
	return (
		typeof data === "object" &&
		data !== null &&
		typeof baseloadDutyCycle === "number" &&
		typeof data.normalThermostat === "number" &&
		typeof rateOfChange === "number"
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
	initiallyObservedRisingEdge: boolean;
	transitionTime?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isThermalObservation(data: any): data is ThermalObservation {
	return (
		typeof data.initiallyObservedRisingEdge === "boolean" &&
		(typeof data.transitionTime === "undefined" ||
			data.transitionTime instanceof Date) &&
		isThermalInterval(data)
	);
}
