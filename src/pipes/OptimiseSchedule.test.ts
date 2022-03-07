import { expect, test } from "vitest";
import { optimiseSchedule } from "./OptimiseSchedule";

test("thermostat is lower when tariff is lower", () => {
	const firstTime = new Date("2022-01-01T00:00");
	const secondTime = new Date("2022-01-01T07:00");
	const thirdTime = new Date("2022-01-02T00:00");
	const schedule = optimiseSchedule(
		[
			{
				startTime: firstTime,
				costPerHour: 27,
				units: "GBP",
				endTime: secondTime,
			},
			{
				startTime: secondTime,
				costPerHour: 34,
				units: "GBP",
				endTime: thirdTime,
			},
		],
		{
			baseloadDutyCycle: 0.5,
			maximumThermostat: 20,
			minimumThermostat: 14,
			normalThermostat: 20,
			temperatureChangeVelocity: -0.1,
		}
	);
	expect(schedule[0].startTime.getTime()).toEqual(firstTime.getTime());
	expect(schedule[0].endTime.getTime()).toEqual(secondTime.getTime());
	expect(schedule[1].startTime.getTime()).toEqual(secondTime.getTime());
	expect(schedule[1].endTime.getTime()).toEqual(thirdTime.getTime());
	const firstThermostat = schedule[0].thermostatSetting;
	const secondThermostat = schedule[1].thermostatSetting;
	expect(firstThermostat).toBeLessThan(secondThermostat);
});
