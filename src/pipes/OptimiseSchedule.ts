import {
	TariffInterval,
	ThermalProperties,
	ThermostatInterval,
} from "@/types/SuperCoolServers.types";

export default function(
	tariffs: TariffInterval[],
	thermalProperties: ThermalProperties
): ThermostatInterval[] {
	return tariffs.map((thisTariff, index) => {
		const nextTariff = tariffs[(index + 1) % tariffs.length];
		if (nextTariff.costPerHour > thisTariff.costPerHour) {
			return {
				startTime: thisTariff.startTime,
				thermostatSetting: thermalProperties.minimumThermostat,
				endTime: thisTariff.endTime,
			};
		} else if (nextTariff.costPerHour < thisTariff.costPerHour) {
			return {
				startTime: thisTariff.startTime,
				thermostatSetting: thermalProperties.maximumThermostat,
				endTime: thisTariff.endTime,
			};
		} else {
			return {
				startTime: thisTariff.startTime,
				thermostatSetting: thermalProperties.normalThermostat,
				endTime: thisTariff.endTime,
			};
		}
	});
}
