import {
	TangibleThermalProperties,
	ThermalInterval,
	ThermostatInterval,
} from "@/types/SuperCoolServers.types";

export default function(
	thermostatSchedule: ThermostatInterval[],
	thermalProperties: TangibleThermalProperties
): ThermalInterval[] {
	const predictions: ThermalInterval[] = [];
	thermostatSchedule.forEach((thermostatInterval) => {
		const isFirst = predictions.length === 0;
		const startTemperature = isFirst
			? thermalProperties.normalThermostat
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
	});
	return predictions;
}
