import { expect, test } from "vitest";
import { toTariffSchedule } from "./ToTariffSchedule.pipe";

test("convert a schedule with cheap rates during daylight hours", () => {
	const result = toTariffSchedule({
		dayCost: 12,
		dayStart: "08:00",
		nightCost: 18,
		nightStart: "19:00",
		units: "GBP",
		version: 0,
		wattage: 100,
	});

	expect(result.units).toEqual("GBP");

	expect(result.intervals[0].costPerHour).toEqual(1200);
	expect(result.intervals[0].startTime.getHours()).toEqual(8);
	expect(result.intervals[0].endTime.getHours()).toEqual(19);

	expect(result.intervals[1].costPerHour).toEqual(1800);
	expect(result.intervals[1].startTime.getHours()).toEqual(19);
	expect(result.intervals[1].endTime.getHours()).toEqual(8);
	
	expect(result.intervals[0].startTime < result.intervals[0].endTime).toBe(true);
	expect(result.intervals[0].endTime == result.intervals[1].startTime).toBe(true);
	expect(result.intervals[1].startTime < result.intervals[1].endTime).toBe(true);
});

test("convert a schedule with cheap overnight rates", () => {
	const result = toTariffSchedule({
		dayCost: 23,
		dayStart: "06:00",
		nightCost: 17,
		nightStart: "01:00",
		units: "USD",
		version: 0,
		wattage: 100,
	});

	expect(result.units).toEqual("USD");

	expect(result.intervals[0].costPerHour).toEqual(1700);
	expect(result.intervals[0].startTime.getHours()).toEqual(1);
	expect(result.intervals[0].endTime.getHours()).toEqual(6);

	expect(result.intervals[1].costPerHour).toEqual(2300);
	expect(result.intervals[1].startTime.getHours()).toEqual(6);
	expect(result.intervals[1].endTime.getHours()).toEqual(1);
	
	expect(result.intervals[0].startTime < result.intervals[0].endTime).toBe(true);
	expect(result.intervals[0].endTime == result.intervals[1].startTime).toBe(true);
	expect(result.intervals[1].startTime < result.intervals[1].endTime).toBe(true);
})
