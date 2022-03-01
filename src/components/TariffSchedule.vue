<template>
	<error-message v-if="error !== undefined" v-on:clear="clearError" />
	<tool-bar
		v-else
		v-bind:download="stringifiedData"
		v-on:clear="clearData"
		v-on:next="onNext"
		v-on:previous="onPrevious"
		v-on:upload="uploadData"
	/>
	<page-header text="Tariff Schedule" />
	<div class="text-input">
		<label for="units" class="section-header">Units:</label>
		<input id="units" v-model="units" />
	</div>
	<div class="text-input">
		<label for="day-cost" class="section-header">
			Daytime consumption per hour:
		</label>
		<input id="day-cost" type="number" v-model.number="dayCost" />
	</div>
	<div class="text-input">
		<label for="day-start" class="section-header">Day rate begins:</label>
		<input id="day-start" type="time" v-model="dayStart" />
	</div>
	<div class="text-input">
		<label for="night-cost" class="section-header">
			Overnight consumption per hour:
		</label>
		<input id="night-cost" type="number" v-model.number="nightCost" />
	</div>
	<div class="text-input">
		<label for="night-start" class="section-header">Night rate begins:</label>
		<input id="night-start" type="time" v-model="nightStart" />
	</div>
	<div class="spacer"></div>
	<tool-bar v-on:next="onNext" />
</template>

<style scoped lang="scss">
.text-input {
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
		outline: 0;
		padding: var(--small);
	}
	> input[type="time"] {
		padding: var(--extra-small);
		padding-left: 2.3em;
	}
}
</style>

<script lang="ts">
import { DataSet, isDataSet } from "@/types";
import { defineComponent } from "vue";
import PageHeader from "./PageHeader.vue";
import ToolBar from "./ToolBar.vue";
import DataParseError from "./ThermalSurvey.vue";

interface TariffSchedule extends DataSet {
	units: string;
	dayCost: number;
	dayStart: string;
	nightCost: number;
	nightStart: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isTariffSchedule(data: any): data is TariffSchedule {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.units === "string" &&
		typeof data.dayCost === "number" &&
		typeof data.dayStart === "string" &&
		typeof data.nightCost === "number" &&
		typeof data.nightStart === "string" &&
		isDataSet(data) &&
		data.version === 0
	);
}

interface TariffScheduleState extends TariffSchedule {
	error?: unknown;
}

export default defineComponent({
	components: { PageHeader, ToolBar },
	computed: {
		stringifiedData(): string {
			return JSON.stringify(this.cleanseData(this.$data));
		},
	},
	created(): void {
		for (const key in this.$data) {
			this.$watch(key, this.saveData, { deep: true });
		}
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
	errorCaptured(error, component, info) {
		console.error(error, component, info);
		this.error = error;
		return false;
	},
	methods: {
		cleanseData(data: TariffScheduleState): TariffScheduleState {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { error, ...cleansedData } = data;
			if (!isTariffSchedule(cleansedData)) {
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
	props: {
		onNext: Function,
		onPrevious: Function,
	},
});
</script>
