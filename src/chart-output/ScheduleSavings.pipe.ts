import { Interval } from "@/SuperCoolServers.types";
import {
	ThermalInterval,
	ThermalProperties,
} from "@/thermal-survey/ThermalSurvey.types";
import { TariffInterval } from "@/tariff-survey/TariffSurvey.types";

export default function (
	thermalPredictions: ThermalInterval[],
	thermalProperties: ThermalProperties,
	tariffSchedule: TariffInterval[]
): number {
	const flatPredictions: ThermalInterval[] = [
		{
			startTime: thermalPredictions[0].startTime,
			startTemperature: thermalProperties.normalThermostat,
			endTime: thermalPredictions[thermalPredictions.length - 1].endTime,
			endTemperature: thermalProperties.normalThermostat,
			dutyCycle: thermalProperties.baseloadDutyCycle,
		},
	];
	const transitionsDedup: { [key: number]: Date } = {};
	const appendTransitions = (interval: Interval) => {
		transitionsDedup[interval.startTime.getTime()] = interval.startTime;
		transitionsDedup[interval.endTime.getTime()] = interval.endTime;
	};
	flatPredictions.forEach(appendTransitions);
	tariffSchedule.forEach(appendTransitions);
	thermalPredictions.forEach(appendTransitions);
	const transitions = Object.values(transitionsDedup).sort((a, b) => {
		return a.getTime() - b.getTime();
	});
	const intervals = transitions.slice(0, -1).map((value, index) => {
		const startTime = transitions[index];
		const endTime = transitions[index + 1];
		const inRange = (interval: Interval) => {
			return interval.startTime <= startTime && interval.endTime >= endTime;
		};
		const tariff = tariffSchedule.filter(inRange)[0];
		const flatPredicition = flatPredictions.filter(inRange)[0];
		const optimisedPrediction = thermalPredictions.filter(inRange)[0];
		return {
			startTime,
			endTime,
			costPerHour: tariff.costPerHour,
			flatDuty: flatPredicition.dutyCycle,
			optimisedDuty: optimisedPrediction.dutyCycle,
		};
	});
	const calculateCost = (interval: TariffInterval, duty: number) => {
		const startMoment = interval.startTime.getTime();
		const endMoment = interval.endTime.getTime();
		const duration = (endMoment - startMoment) / (1000 * 60 * 60);
		return duty * duration * interval.costPerHour;
	};
	const flatCost = intervals.reduce((total, interval) => {
		return total + calculateCost(interval, interval.flatDuty);
	}, 0);
	const optimisedCost = intervals.reduce((total, interval) => {
		return total + calculateCost(interval, interval.optimisedDuty);
	}, 0);
	const annualSaving = (flatCost - optimisedCost) * 365.25;
	return annualSaving;
}
