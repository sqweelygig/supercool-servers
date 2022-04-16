import { ThermalInterval } from "./ThermalSurvey.types";

export default function summariseObservations(
	observations: ThermalInterval[]
): {
	baseloadDutyCycle: number | null;
	temperatureChangeVelocity: number | null;
} {
	const thermostaticObservations = observations.filter(
		(observation: ThermalInterval) => {
			return observation.endTemperature === observation.startTemperature;
		}
	);
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
	const rateOfChange = totalVelocity / totalTemperatureChange;
	return {
		// Since JSON flattens NaN to null, and I don't like NaN, we're flattening this at source.
		baseloadDutyCycle: isNaN(baseloadDutyCycle) ? null : baseloadDutyCycle,
		temperatureChangeVelocity: isNaN(rateOfChange) ? null : rateOfChange,
	};
}
