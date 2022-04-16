import { TariffScheduleState, TariffInterval } from "./TariffSchedule.types";

export function toTariffIntervals(data: TariffScheduleState): TariffInterval[] {
	const addDay = (date: Date) => {
		return new Date(date.getTime() + 24 * 60 * 60 * 1000);
	};
	const today = new Date();
	const dayStart = new Date(today.toDateString() + " " + data.dayStart);
	const nightStart = new Date(today.toDateString() + " " + data.nightStart);
	if (dayStart < nightStart) {
		const nextDayStart = addDay(dayStart);
		return [
			{
				costPerHour: data.dayCost,
				endTime: nightStart,
				startTime: dayStart,
				units: data.units,
			},
			{
				costPerHour: data.nightCost,
				endTime: nextDayStart,
				startTime: nightStart,
				units: data.units,
			},
		];
	} else if (dayStart > nightStart) {
		const nextNightStart = addDay(nightStart);
		return [
			{
				costPerHour: data.nightCost,
				endTime: dayStart,
				startTime: nightStart,
				units: data.units,
			},
			{
				costPerHour: data.dayCost,
				endTime: nextNightStart,
				startTime: dayStart,
				units: data.units,
			},
		];
	} else {
		const nextDayStart = addDay(dayStart);
		return [
			{
				costPerHour: data.dayCost,
				endTime: nextDayStart,
				startTime: dayStart,
				units: data.units,
			},
		];
	}
}
