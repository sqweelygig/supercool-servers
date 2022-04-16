import { expect, test } from "vitest";
import summariseObservations from "./SummariseObservations.pipe";
import { ThermalInterval } from "./ThermalSurvey.types";

test("summarise single thermostatic observation", () => {
	const observations: ThermalInterval[] = [
		{
			startTime: new Date("2022-01-01T07:00"),
			startTemperature: 14,
			endTime: new Date("2022-01-01T07:30"),
			endTemperature: 14,
			dutyCycle: 0.5,
		},
		{
			startTime: new Date("2022-01-01T07:30"),
			startTemperature: 14,
			endTime: new Date("2022-01-01T08:30"),
			endTemperature: 12,
			dutyCycle: 1.0,
		},
	];
	const summary = summariseObservations(observations);
	expect(summary.baseloadDutyCycle).toBeCloseTo(0.5);
});

test("summarise two equal thermostatic observations", () => {
	const observations: ThermalInterval[] = [
		{
			startTime: new Date("2022-01-01T07:00"),
			startTemperature: 18,
			endTime: new Date("2022-01-01T07:30"),
			endTemperature: 18,
			dutyCycle: 0.4,
		},
		{
			startTime: new Date("2022-01-01T07:30"),
			startTemperature: 18,
			endTime: new Date("2022-01-01T08:00"),
			endTemperature: 18,
			dutyCycle: 0.6,
		},
		{
			startTime: new Date("2022-01-01T07:30"),
			startTemperature: 14,
			endTime: new Date("2022-01-01T08:30"),
			endTemperature: 12,
			dutyCycle: 1.0,
		},
	];
	const summary = summariseObservations(observations);
	expect(summary.baseloadDutyCycle).toBeCloseTo(0.5);
});

test("summarise two unequal thermostatic observations", () => {
	const observations: ThermalInterval[] = [
		{
			startTime: new Date("2022-01-01T07:00"),
			startTemperature: 18,
			endTime: new Date("2022-01-01T07:10"),
			endTemperature: 18,
			dutyCycle: 0.5,
		},
		{
			startTime: new Date("2022-01-01T07:10"),
			startTemperature: 18,
			endTime: new Date("2022-01-01T07:30"),
			endTemperature: 18,
			dutyCycle: 0.8,
		},
		{
			startTime: new Date("2022-01-01T07:30"),
			startTemperature: 14,
			endTime: new Date("2022-01-01T08:30"),
			endTemperature: 12,
			dutyCycle: 1.0,
		},
	];
	const summary = summariseObservations(observations);
	expect(summary.baseloadDutyCycle).toBeCloseTo(0.7);
});

test("summarise single thermodynamic observation", () => {
	const observations: ThermalInterval[] = [
		{
			startTime: new Date("2022-01-01T07:00"),
			startTemperature: 18,
			endTime: new Date("2022-01-01T07:30"),
			endTemperature: 18,
			dutyCycle: 0.5,
		},
		{
			startTime: new Date("2022-01-01T07:30"),
			startTemperature: 18,
			endTime: new Date("2022-01-01T08:00"),
			endTemperature: 17,
			dutyCycle: 1,
		},
	];
	const summary = summariseObservations(observations);
	expect(summary.baseloadDutyCycle).toBeCloseTo(0.5);
	expect(summary.temperatureChangeVelocity).toBeCloseTo(-4.0);
});

test("summarise two thermodynamic observations", () => {
	const observations: ThermalInterval[] = [
		{
			startTime: new Date("2022-01-01T07:00"),
			startTemperature: 18,
			endTime: new Date("2022-01-01T07:30"),
			endTemperature: 18,
			dutyCycle: 0.8,
		},
		{
			startTime: new Date("2022-01-01T07:30"),
			startTemperature: 18,
			endTime: new Date("2022-01-01T08:10"),
			endTemperature: 17,
			dutyCycle: 1,
		},
		{
			startTime: new Date("2022-01-01T08:10"),
			startTemperature: 17,
			endTime: new Date("2022-01-01T08:20"),
			endTemperature: 18,
			dutyCycle: 0,
		},
	];
	const summary = summariseObservations(observations);
	expect(summary.baseloadDutyCycle).toBeCloseTo(0.8);
	expect(summary.temperatureChangeVelocity).toBeCloseTo(-7.5);
});
