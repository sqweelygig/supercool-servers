import { expect, test } from "vitest";
import modelSchedule from "./ModelSchedule.pipe";

test("model a room with a flat thermostat schedule", () => {
	const startTime = new Date("2022-01-01T07:00");
	const endTime = new Date("2022-01-01T07:30");
	const normalThermostat = 20;
	const thermostatSchedule = [
		{
			startTime,
			thermostatSetting: normalThermostat,
			endTime,
		},
	];
	const thermalProperties = {
		baseloadDutyCycle: 0.4,
		temperatureChangeVelocity: -0.1,
		normalThermostat,
	};
	const thermalPrediction = modelSchedule(
		thermostatSchedule,
		thermalProperties
	);
	expect(thermalPrediction.length).toEqual(1);
	expect(thermalPrediction[0].dutyCycle).toBeCloseTo(0.4);
	expect(thermalPrediction[0].startTime.getTime()).toEqual(startTime.getTime());
	expect(thermalPrediction[0].endTime.getTime()).toEqual(endTime.getTime());
	expect(thermalPrediction[0].endTemperature).toEqual(normalThermostat);
	expect(thermalPrediction[0].startTemperature).toEqual(normalThermostat);
});

test("model a room that will cool but not reach equilibrium", () => {
	const startTime = new Date("2022-01-01T07:00");
	const endTime = new Date("2022-01-01T08:00");
	const nextTime = new Date("2022-01-02T07:00");
	const thermostatSchedule = [
		{
			startTime,
			thermostatSetting: 18,
			endTime,
		},
		{
			startTime: endTime,
			thermostatSetting: 20,
			endTime: nextTime,
		},
	];
	const thermalProperties = {
		baseloadDutyCycle: 0.5,
		normalThermostat: 20,
		temperatureChangeVelocity: -2.0,
	};
	const thermalPrediction = modelSchedule(
		thermostatSchedule,
		thermalProperties
	);
	expect(thermalPrediction.length).toEqual(3);
	expect(thermalPrediction[0].dutyCycle).toBeCloseTo(1.0);
	expect(thermalPrediction[0].startTime.getTime()).toEqual(startTime.getTime());
	expect(thermalPrediction[0].endTime.getTime()).toEqual(endTime.getTime());
	expect(thermalPrediction[0].startTemperature).toEqual(20);
	expect(thermalPrediction[0].endTemperature).toBeCloseTo(19);
});

test("model a room that will cool to equilibrium", () => {
	const startTime = new Date("2022-01-01T07:00");
	const halfTime = new Date("2022-01-01T07:30");
	const endTime = new Date("2022-01-01T08:00");
	const nextTime = new Date("2022-01-02T07:00");
	const thermostatSchedule = [
		{
			startTime,
			thermostatSetting: 18,
			endTime,
		},
		{
			startTime: endTime,
			thermostatSetting: 20,
			endTime: nextTime,
		},
	];
	const thermalProperties = {
		baseloadDutyCycle: 0.5,
		normalThermostat: 20,
		temperatureChangeVelocity: -8.0,
	};
	const thermalPrediction = modelSchedule(
		thermostatSchedule,
		thermalProperties
	);
	expect(thermalPrediction.length).toEqual(4);
	expect(thermalPrediction[0].dutyCycle).toEqual(1.0);
	expect(thermalPrediction[0].startTime.getTime()).toEqual(startTime.getTime());
	expect(thermalPrediction[0].endTime.getTime()).toEqual(halfTime.getTime());
	expect(thermalPrediction[0].startTemperature).toEqual(20);
	expect(thermalPrediction[0].endTemperature).toEqual(18);
	expect(thermalPrediction[1].dutyCycle).toEqual(0.5);
	expect(thermalPrediction[1].startTime.getTime()).toEqual(halfTime.getTime());
	expect(thermalPrediction[1].endTime.getTime()).toEqual(endTime.getTime());
	expect(thermalPrediction[1].startTemperature).toEqual(18);
	expect(thermalPrediction[1].endTemperature).toEqual(18);
});

test("model a room that will warm, but not to equilibrium", () => {
	const startTime = new Date("2022-01-01T07:00");
	const endTime = new Date("2022-01-01T07:30");
	const nextTime = new Date("2022-01-02T07:00");
	const thermostatSchedule = [
		{
			startTime,
			thermostatSetting: 21,
			endTime,
		},
		{
			startTime: endTime,
			thermostatSetting: 20,
			endTime: nextTime,
		}
	];
	const thermalProperties = {
		baseloadDutyCycle: 0.25,
		normalThermostat: 20,
		temperatureChangeVelocity: -2.0,
	};
	const thermalPrediction = modelSchedule(
		thermostatSchedule,
		thermalProperties
	);
	expect(thermalPrediction.length).toEqual(3);
	expect(thermalPrediction[0].dutyCycle).toEqual(0.0);
	expect(thermalPrediction[0].startTime.getTime()).toEqual(startTime.getTime());
	expect(thermalPrediction[0].endTime.getTime()).toEqual(endTime.getTime());
	expect(thermalPrediction[0].startTemperature).toEqual(20);
	expect(thermalPrediction[0].endTemperature).toBeCloseTo(20.25);
});

test("model a room that will warm to equilibrium", () => {
	const startTime = new Date("2022-01-01T07:00");
	const endTime = new Date("2022-01-01T13:00");
	const nextTime = new Date("2022-01-02T07:00");
	const thermostatSchedule = [
		{
			startTime,
			thermostatSetting: 21,
			endTime,
		},
		{
			startTime: endTime,
			thermostatSetting: 20,
			endTime: nextTime,
		},
	];
	const thermalProperties = {
		baseloadDutyCycle: 0.25,
		normalThermostat: 20,
		temperatureChangeVelocity: -2.0,
	};
	const partTime = new Date("2022-01-01T09:00");
	const thermalPrediction = modelSchedule(
		thermostatSchedule,
		thermalProperties
	);
	expect(thermalPrediction.length).toEqual(4);
	expect(thermalPrediction[0].dutyCycle).toEqual(0.0);
	expect(thermalPrediction[0].startTime.getTime()).toEqual(startTime.getTime());
	expect(thermalPrediction[0].endTime.getTime()).toEqual(partTime.getTime());
	expect(thermalPrediction[0].startTemperature).toEqual(20);
	expect(thermalPrediction[0].endTemperature).toEqual(21);
	expect(thermalPrediction[1].dutyCycle).toEqual(0.25);
	expect(thermalPrediction[1].startTime.getTime()).toEqual(partTime.getTime());
	expect(thermalPrediction[1].endTime.getTime()).toEqual(endTime.getTime());
	expect(thermalPrediction[1].startTemperature).toEqual(21);
	expect(thermalPrediction[1].endTemperature).toEqual(21);
});

test("model a room with multiple scheduled thermostat intervals", () => {
	const thermostatSchedule = [
		{
			startTime: new Date("2022-01-01T07:00"),
			thermostatSetting: 21,
			endTime: new Date("2022-01-02T00:00"),
		},
		{
			startTime: new Date("2022-01-02T00:00"),
			thermostatSetting: 18,
			endTime: new Date("2022-01-02T07:00"),
		},
	];
	const thermalProperties = {
		baseloadDutyCycle: 0.4,
		normalThermostat: 20,
		temperatureChangeVelocity: -2.0,
	};
	const thermalPrediction = modelSchedule(
		thermostatSchedule,
		thermalProperties
	);
	expect(thermalPrediction.length).toEqual(4);
	expect(thermalPrediction[0].startTemperature).toEqual(18);
	expect(thermalPrediction[0].endTemperature).toEqual(21);
	expect(thermalPrediction[1].startTemperature).toEqual(21);
	expect(thermalPrediction[1].endTemperature).toEqual(21);
	expect(thermalPrediction[2].startTemperature).toEqual(21);
	expect(thermalPrediction[2].endTemperature).toEqual(18);
	expect(thermalPrediction[3].startTemperature).toEqual(18);
	expect(thermalPrediction[3].endTemperature).toEqual(18);
});
