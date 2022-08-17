import { TariffSurveyState, TariffSchedule } from "./TariffSurvey.types";

export function toTariffSchedule(data: TariffSurveyState): TariffSchedule {
	const addDay = (date: Date) => {
		return new Date(date.getTime() + 24 * 60 * 60 * 1000);
	};
	const today = new Date();
	const dayStart = new Date(today.toDateString() + " " + data.dayStart);
	const nightStart = new Date(today.toDateString() + " " + data.nightStart);
	if (dayStart < nightStart) {
		const nextDayStart = addDay(dayStart);
		return {
			intervals: [
				{
					costPerHour: data.dayCost * data.wattage,
					endTime: nightStart,
					startTime: dayStart,
				},
				{
					costPerHour: data.nightCost * data.wattage,
					endTime: nextDayStart,
					startTime: nightStart,
				},
			],
			units: data.units,
		};
	} else if (dayStart > nightStart) {
		const nextNightStart = addDay(nightStart);
		return {
			intervals: [
				{
					costPerHour: data.nightCost * data.wattage,
					endTime: dayStart,
					startTime: nightStart,
				},
				{
					costPerHour: data.dayCost * data.wattage,
					endTime: nextNightStart,
					startTime: dayStart,
				},
			],
			units: data.units,
		};
	} else {
		const nextDayStart = addDay(dayStart);
		return {
			intervals: [
				{
					costPerHour: data.dayCost * data.wattage,
					endTime: nextDayStart,
					startTime: dayStart,
				},
			],
			units: data.units,
		};
	}
}
