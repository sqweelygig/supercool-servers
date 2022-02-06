<template>
	<error-message
		v-if="this.hasError"
		v-bind:error="error"
		v-bind:on-clear="this.clearError"
	/>
	<tool-bar
		v-else
		v-bind:on-clear="this.clearData"
		v-bind:on-upload="this.uploadData"
		v-bind:download="this.stringifiedData"
	/>
	<page-header text="Normal operation" />
	<number-slider
		id="current-slider"
		v-bind:maximum="30"
		v-bind:minimum="10"
		question="What is the thermostat set to?"
		units="°C"
		v-model.number="normalThermostat"
	/>
	<duty-cycle
		v-bind:clear="this.clearObservation"
		v-bind:initial-observation="currentObservation.initialObservation"
		v-bind:observations="observations"
		v-bind:observe="this.observe"
		v-bind:transition-time="currentObservation.transitionTime"
	/>
</template>

<style scoped lang="scss">
:deep() {
	margin: 1rem;
	> * {
		display: block;
		margin: 0.5rem 0;
		width: 100%;
	}
	> .section-header {
		font-size: 1.2em;
	}
	> *:first-child {
		margin-top: 0;
	}
	> *:last-child {
		margin-bottom: 0;
	}
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import DutyCycle, { CurrentObservation } from "./DutyCycle.vue";
import ErrorMessage from "./ErrorMessage.vue";
import NumberSlider from "./NumberSlider.vue";
import PageHeader from "./PageHeader.vue";
import ToolBar from "./ToolBar.vue";
import {
	DataSet,
	isDataSet,
	ThermalInterval,
	isThermalInterval,
} from "../types";

enum ObservationPhases {
	Intro = "intro",
	Normal = "normal",
	Warmer = "warmer",
	Cooler = "cooler",
	Reset = "reset",
	Complete = "complete",
}

interface ThermalObservations extends DataSet {
	maximumThermostat: number;
	minimumThermostat: number;
	normalThermostat: number;
	observations: Array<ThermalInterval>;
	phase: ObservationPhases;
}

interface ThermalObservationsState extends ThermalObservations {
	currentObservation: CurrentObservation;
	error?: Error;
}

class DataParseError extends Error {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isThermalObservations(data: any): data is ThermalObservations {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.maximumThermostat === "number" &&
		typeof data.minimumThermostat === "number" &&
		typeof data.normalThermostat === "number" &&
		Array.isArray(data.observations) &&
		data.observations.every(isThermalInterval) &&
		Object.values(ObservationPhases).includes(data.phase) &&
		isDataSet(data) &&
		data.version === 1
	);
}

export default defineComponent({
	created(): void {
		for (const key in this.$data) {
			this.$watch(key, this.saveData, { deep: true });
		}
	},
	computed: {
		stringifiedData: function (): string {
			return JSON.stringify(this.cleanseData(this.$data));
		},
		hasError: function (): boolean {
			return this.$data.error !== undefined;
		},
	},
	components: { DutyCycle, ErrorMessage, NumberSlider, PageHeader, ToolBar },
	data(): ThermalObservationsState {
		if (localStorage.thermalData) {
			try {
				const rawData = JSON.parse(localStorage.thermalData);
				return this.defaultData(this.cleanseData(rawData));
			} catch (error) {
				console.error(error);
				return this.defaultData({
					error: new Error("Could not load previous state."),
				});
			}
		} else {
			return this.defaultData();
		}
	},
	methods: {
		cleanseData: function (
			data: ThermalObservationsState
		): ThermalObservations {
			// Drop transient properties
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { error, currentObservation, ...cleansedData } = data;
			if (!isThermalObservations(data)) {
				throw new DataParseError("Data not valid.");
			}
			return cleansedData;
		},
		clearData: function (): void {
			delete localStorage.thermalData;
			this.clearError();
			Object.assign(this, this.defaultData());
		},
		clearObservation: function (): void {
			this.$data.currentObservation.initialObservation = undefined;
			this.$data.currentObservation.startTime = undefined;
			this.$data.currentObservation.transitionTime = undefined;
		},
		clearError: function (): void {
			delete this.$data.error;
		},
		defaultData: function (
			data?: Partial<ThermalObservationsState>
		): ThermalObservationsState {
			return {
				currentObservation: {
					initialObservation: undefined,
					startTime: undefined,
					transitionTime: undefined,
				},
				maximumThermostat: 20,
				minimumThermostat: 14,
				normalThermostat: 18,
				observations: [],
				phase: ObservationPhases.Normal,
				version: 1,
				...data,
			};
		},
		observe(isRisingEdge: boolean): void {
			const rightNow = Date.now();
			const observation = this.$data.currentObservation;
			if (observation.startTime === undefined) {
				observation.startTime = rightNow;
				observation.initialObservation = isRisingEdge;
			} else if (observation.transitionTime === undefined) {
				observation.transitionTime = rightNow;
			} else {
				const initialTime = observation.transitionTime - observation.startTime;
				const totalTime = rightNow - observation.startTime;
				const initialProportion = initialTime / totalTime;
				const dutyCycle = observation.initialObservation
					? initialProportion
					: 1 - initialProportion;
				this.$data.observations.push({
					dutyCycle,
					endTemperature: this.normalThermostat,
					endTime: rightNow,
					startTemperature: this.normalThermostat,
					startTime: observation.startTime,
					thermostatSetting: this.normalThermostat,
				});
				observation.initialObservation = isRisingEdge;
				observation.startTime = rightNow;
				observation.transitionTime = undefined;
			}
		},
		saveData: function (): void {
			localStorage.thermalData = this.stringifiedData;
		},
		uploadData: function (data: string): void {
			try {
				this.clearError();
				const rawData = JSON.parse(data);
				const cleanedData = this.defaultData(this.cleanseData(rawData));
				Object.assign(this, cleanedData);
			} catch (error) {
				console.error(error);
				this.$data.error = new Error("Data upload failed.");
			}
		},
	},
	name: "Thermal Survey",
});
</script>
