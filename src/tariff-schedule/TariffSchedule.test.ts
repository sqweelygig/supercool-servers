import { expect, test } from "vitest";
import { toTariffIntervals } from "./TariffSchedule.pipes";

test("convert a schedule with cheap rates during daylight hours", () => {
	const result = toTariffIntervals({
		dayCost: 12,
		dayStart: "08:00",
		nightCost: 18,
		nightStart: "19:00",
		units: "GBP",
		version: 0,
	});
	expect(result[0].costPerHour).toEqual(12);
	expect(result[0].units).toEqual("GBP");
	expect(result[0].startTime.getHours()).toEqual(8);
	expect(result[0].endTime.getHours()).toEqual(19);

	expect(result[1].costPerHour).toEqual(18);
	expect(result[1].units).toEqual("GBP");
	expect(result[1].startTime.getHours()).toEqual(19);
	expect(result[1].endTime.getHours()).toEqual(8);
	
	expect(result[0].startTime < result[0].endTime).toBe(true);
	expect(result[0].endTime == result[1].startTime).toBe(true);
	expect(result[1].startTime < result[1].endTime).toBe(true);
});

test("convert a schedule with cheap overnight rates", () => {
	const result = toTariffIntervals({
		dayCost: 23,
		dayStart: "06:00",
		nightCost: 17,
		nightStart: "01:00",
		units: "USD",
		version: 0,
	});

	expect(result[0].costPerHour).toEqual(17);
	expect(result[0].units).toEqual("USD");
	expect(result[0].startTime.getHours()).toEqual(1);
	expect(result[0].endTime.getHours()).toEqual(6);

	expect(result[1].costPerHour).toEqual(23);
	expect(result[1].units).toEqual("USD");
	expect(result[1].startTime.getHours()).toEqual(6);
	expect(result[1].endTime.getHours()).toEqual(1);
	
	expect(result[0].startTime < result[0].endTime).toBe(true);
	expect(result[0].endTime == result[1].startTime).toBe(true);
	expect(result[1].startTime < result[1].endTime).toBe(true);
})
