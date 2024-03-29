import { ThermalInterval } from "./ThermalSurvey.types";

export default function summariseObservations(
	observations: ThermalInterval[]
): {
	baseloadDutyCycle: number;
	temperatureChangeVelocity: number;
} {
	const thermostaticObservations = observations.filter(
		(observation: ThermalInterval) => {
			return observation.endTemperature === observation.startTemperature;
		}
	);
	if (thermostaticObservations.length === 0) {
		throw new Error("Cannot summarise without thermostatic observations.");
	}
	const totalElapsed: number = thermostaticObservations.reduce(
		(runningTotal: number, each: ThermalInterval) => {
			const elapsed = each.endTime.getTime() - each.startTime.getTime();
			return runningTotal + elapsed;
		},
		0
	);
	const totalDuty: number = thermostaticObservations.reduce(
		(runningTotal: number, each: ThermalInterval) => {
			const elapsed = each.endTime.getTime() - each.startTime.getTime();
			return runningTotal + each.dutyCycle * elapsed;
		},
		0
	);
	const baseloadDutyCycle = totalDuty / totalElapsed;
	const thermodynamicObservations = observations.filter(
		(observation: ThermalInterval) => {
			return observation.endTemperature !== observation.startTemperature;
		}
	);
	if (thermodynamicObservations.length === 0) {
		throw new Error("Cannot summarise without thermodynamic observations.");
	}
	const totalTemperatureChange: number = thermodynamicObservations.reduce(
		(runningTotal: number, each: ThermalInterval) => {
			const temperatureChange = each.endTemperature - each.startTemperature;
			return runningTotal + Math.abs(temperatureChange);
		},
		0
	);
	const totalVelocity: number = thermodynamicObservations.reduce(
		(runningTotal: number, each: ThermalInterval) => {
			const temperatureChange = each.endTemperature - each.startTemperature;
			const weighting = Math.abs(temperatureChange);
			const msElapsed = each.endTime.getTime() - each.startTime.getTime();
			const hoursElapsed = msElapsed / (1000 * 60 * 60);
			const effectiveDuty = each.dutyCycle - baseloadDutyCycle;
			const velocity = temperatureChange / (effectiveDuty * hoursElapsed);
			return runningTotal + weighting * velocity;
		},
		0
	);
	const temperatureChangeVelocity = totalVelocity / totalTemperatureChange;
	return {
		baseloadDutyCycle,
		temperatureChangeVelocity,
	};
}
