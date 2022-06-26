import { ThermostatInterval } from "@/SuperCoolServers.types";
import {
	TangibleThermalProperties,
	ThermalInterval,
} from "@/thermal-survey/ThermalSurvey.types";

function enclosePredicter(
	predictions: ThermalInterval[],
	thermalProperties: TangibleThermalProperties,
	cycleStartTemperature: number
) {
	return (thermostatInterval: ThermostatInterval) => {
		const isFirst = predictions.length === 0;
		const startTemperature = isFirst
			? cycleStartTemperature
			: predictions[predictions.length - 1].endTemperature;
		if (thermostatInterval.thermostatSetting === startTemperature) {
			predictions.push({
				startTemperature,
				startTime: thermostatInterval.startTime,
				dutyCycle: thermalProperties.baseloadDutyCycle,
				endTemperature: thermostatInterval.thermostatSetting,
				endTime: thermostatInterval.endTime,
			});
		} else {
			const thermostatSetting = thermostatInterval.thermostatSetting;
			const changeRequired = thermostatSetting - startTemperature;
			const dutyCycle = changeRequired < 0.0 ? 1.0 : 0.0;
			const baseloadDutyCycle = thermalProperties.baseloadDutyCycle;
			const effectiveDuty = dutyCycle - baseloadDutyCycle;
			const temperatureVelocity = thermalProperties.temperatureChangeVelocity;
			const effectiveVelocity = effectiveDuty * temperatureVelocity;
			const endTime = thermostatInterval.endTime;
			const startTime = thermostatInterval.startTime;
			const timeAvailable = endTime.getTime() - startTime.getTime();
			const hoursAvailable = timeAvailable / (60 * 60 * 1000);
			const hoursRequired = changeRequired / effectiveVelocity;
			if (hoursRequired > hoursAvailable) {
				const temperatureChange = hoursAvailable * effectiveVelocity;
				predictions.push({
					startTemperature,
					startTime,
					dutyCycle,
					endTemperature: startTemperature + temperatureChange,
					endTime,
				});
			} else {
				const timeRequired = hoursRequired * 60 * 60 * 1000;
				const transitionTime = new Date(startTime.getTime() + timeRequired);
				predictions.push({
					startTemperature,
					startTime,
					dutyCycle,
					endTemperature: thermostatSetting,
					endTime: transitionTime,
				});
				predictions.push({
					startTemperature: thermostatSetting,
					startTime: transitionTime,
					dutyCycle: baseloadDutyCycle,
					endTemperature: thermostatSetting,
					endTime,
				});
			}
		}
	};
}

export default function (
	schedule: ThermostatInterval[],
	properties: TangibleThermalProperties
): ThermalInterval[] {
	let nextStart = properties.normalThermostat;
	let predictions: ThermalInterval[];
	do {
		predictions = [];
		schedule.forEach(enclosePredicter(predictions, properties, nextStart));
		nextStart = predictions[predictions.length - 1].endTemperature;
	} while (
		predictions[0].startTemperature !==
		predictions[predictions.length - 1].endTemperature
	);
	return predictions;
}
