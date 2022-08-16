import { TariffInterval } from "@/tariff-survey/TariffSurvey.types";
import { ThermalInterval, ThermalProperties } from "@/thermal-survey/ThermalSurvey.types";
import { expect, test } from "vitest";
import scheduleSavings from "./ScheduleSavings.pipe";

test("expect shifting of energy usage to save money", () => {
	const splitTariff: TariffInterval[] = [
		{
			startTime: new Date("01/01/2000, 01:00"),
			endTime: new Date("01/01/2000, 03:00"),
			costPerHour: 8,
		},
		{
			startTime: new Date("01/01/2000, 03:00"),
			endTime: new Date("02/01/2000, 01:00"),
			costPerHour: 9,
		}
	]
	const thermalProperties: ThermalProperties = {
		maximumThermostat: 24,
		minimumThermostat: 16,
		normalThermostat: 22,
		baseloadDutyCycle: 0.25,
		temperatureChangeVelocity: 1,
	}
	// This manages to offset 3 blocks of 30 minutes x 0.25 duty-cycle
	const thermalPredictions: ThermalInterval[] = [
		{
			startTime: new Date("01/01/2000, 01:00"),
			endTime: new Date("01/01/2000, 01:30"),
			startTemperature: 24,
			endTemperature: 16,
			dutyCycle: 1,
		},
		{
			startTime: new Date("01/01/2000, 01:30"),
			endTime: new Date("01/01/2000, 03:00"),
			startTemperature: 16,
			endTemperature: 16,
			dutyCycle: 0.25,
		},
		{
			startTime: new Date("01/01/2000, 03:00"),
			endTime: new Date("01/01/2000, 04:30"),
			startTemperature: 16,
			endTemperature: 24,
			dutyCycle: 0,
		},
		{
			startTime: new Date("01/01/2000, 04:30"),
			endTime: new Date("02/01/2000, 01:00"),
			startTemperature: 24,
			endTemperature: 24,
			dutyCycle: 0.25,
		}
	];
	expect(scheduleSavings(thermalPredictions, thermalProperties, splitTariff)).toBeCloseTo(136.96875);
});
