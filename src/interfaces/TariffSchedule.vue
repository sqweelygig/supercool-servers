<template>
	<error-message v-if="error !== undefined" v-on:clear="clearError" />
	<tool-bar
		v-else
		v-bind:download="stringifiedData"
		v-on:clear="clearData"
		v-on:next="$emit('next')"
		v-on:previous="$emit('previous')"
		v-on:upload="uploadData"
	/>
	<page-header text="Tariff Schedule" />
	<div class="form-group">
		<label for="units" class="section-header">Units:</label>
		<input id="units" v-model="units" />
	</div>
	<div class="form-group">
		<label for="day-cost" class="section-header">
			Daytime consumption per hour:
		</label>
		<input id="day-cost" type="number" v-model.number="dayCost" />
	</div>
	<div class="form-group">
		<label for="day-start" class="section-header">Day rate begins:</label>
		<input id="day-start" type="time" v-model="dayStart" />
	</div>
	<div class="form-group">
		<label for="night-cost" class="section-header">
			Overnight consumption per hour:
		</label>
		<input id="night-cost" type="number" v-model.number="nightCost" />
	</div>
	<div class="form-group">
		<label for="night-start" class="section-header">Night rate begins:</label>
		<input id="night-start" type="time" v-model="nightStart" />
	</div>
	<div class="spacer"></div>
	<tool-bar v-on:next="$emit('next')" />
</template>

<style scoped lang="scss">
.form-group {
	> * {
		display: block;
	}
	> label {
		text-transform: capitalize;
	}
	> input {
		background-color: var(--light);
		border-radius: var(--medium-small);
		font-size: var(--medium-large);
		padding: var(--small);
	}
	> input[type="time"] {
		padding: var(--extra-small);
		padding-left: 2.3em;
	}
}
</style>

<script lang="ts">
import {
	DataParseError,
	DataSet,
	Interval,
	isDataSet,
	isInterval,
} from "@/types";
import { defineComponent } from "vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import PageHeader from "@/components/PageHeader.vue";
import ToolBar from "@/components/ToolBar.vue";

export interface TariffInterval extends Interval {
	costPerHour: number;
	units: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isTariffInterval(data: any): data is TariffInterval {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.costPerHour === "number" &&
		typeof data.units === "string" &&
		isInterval(data)
	);
}

interface TariffScheduleState extends DataSet {
	dayCost: number;
	dayStart: string;
	error?: unknown;
	nightCost: number;
	nightStart: string;
	units: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isTariffScheduleState(data: any): data is TariffScheduleState {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.dayCost === "number" &&
		typeof data.dayStart === "string" &&
		typeof data.nightCost === "number" &&
		typeof data.nightStart === "string" &&
		typeof data.units === "string" &&
		isDataSet(data) &&
		data.version === 0
	);
}

export default defineComponent({
	components: { ErrorMessage, PageHeader, ToolBar },
	computed: {
		stringifiedData(): string {
			return JSON.stringify(this.cleanseData(this.$data));
		},
		tariffIntervals(): TariffInterval[] {
			const addDay = (date: Date) => {
				return new Date(date.getTime() + 24 * 60 * 60 * 1000);
			};
			const today = new Date();
			const dayStart = new Date(today.toDateString() + " " + this.dayStart);
			const nightStart = new Date(today.toDateString() + " " + this.nightStart);
			if (dayStart < nightStart) {
				const nextDayStart = addDay(dayStart);
				return [
					{
						costPerHour: this.dayCost,
						endTime: nightStart,
						startTime: dayStart,
						units: this.units,
					},
					{
						costPerHour: this.nightCost,
						endTime: nextDayStart,
						startTime: nightStart,
						units: this.units,
					},
				];
			} else if (dayStart > nightStart) {
				const nextNightStart = addDay(nightStart);
				return [
					{
						costPerHour: this.nightCost,
						endTime: dayStart,
						startTime: nightStart,
						units: this.units,
					},
					{
						costPerHour: this.dayCost,
						endTime: nextNightStart,
						startTime: dayStart,
						units: this.units,
					},
				];
			} else {
				const nextDayStart = addDay(dayStart);
				return [
					{
						costPerHour: this.dayCost,
						endTime: nextDayStart,
						startTime: dayStart,
						units: this.units,
					},
				];
			}
		},
	},
	created(): void {
		for (const key in this.$data) {
			this.$watch(key, this.saveData, { deep: true });
			this.$watch(key, () => this.$emit("update", this.tariffIntervals), {
				deep: true,
			});
		}
		this.$emit("update", this.tariffIntervals);
	},
	data(): TariffScheduleState {
		// TODO Combine this with similar methods in ThermalSurvey so its DRY.
		if (localStorage.tariffData) {
			try {
				const rawData = JSON.parse(localStorage.tariffData);
				return this.defaultData(this.cleanseData(rawData));
			} catch (error) {
				delete localStorage.tariffData;
				console.error(error);
				return this.defaultData({ error });
			}
		} else {
			return this.defaultData();
		}
	},
	emits: {
		next(): boolean {
			return true;
		},
		previous(): boolean {
			return true;
		},
		update(data: TariffInterval[]): boolean {
			return data.every(isTariffInterval);
		},
	},
	errorCaptured(error, component, info) {
		console.error(error, component, info);
		this.error = error;
		return false;
	},
	methods: {
		cleanseData(data: TariffScheduleState): TariffScheduleState {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { error, ...cleansedData } = data;
			if (!isTariffScheduleState(cleansedData)) {
				throw new DataParseError("Data not valid.");
			}
			return cleansedData;
		},
		clearData(): void {
			delete localStorage.tariffData;
			this.clearError();
			Object.assign(this.$data, this.defaultData());
		},
		clearError(): void {
			delete this.$data.error;
		},
		defaultData(data?: Partial<TariffScheduleState>): TariffScheduleState {
			return {
				dayCost: 4700,
				dayStart: "07:00",
				error: undefined,
				nightCost: 3400,
				nightStart: "00:00",
				units: "pence",
				version: 0,
				...data,
			};
		},
		saveData(): void {
			localStorage.tariffData = this.stringifiedData;
		},
		uploadData(data: string): void {
			try {
				this.clearError();
				const rawData = JSON.parse(data);
				const cleanedData = this.defaultData(this.cleanseData(rawData));
				Object.assign(this.$data, cleanedData);
			} catch (error) {
				console.error(error);
				this.$data.error = error;
			}
		},
	},
});
</script>
