<template>
	<div>
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
	</div>
	<div>
		<page-header text="Normal" />
		<number-slider
			id="current-slider"
			v-bind:maximum="30"
			v-bind:minimum="10"
			question="What is the thermostat set to?"
			units="°C"
			v-model.number="normalThermostat"
		/>
		<duty-cycle
			explanation="Please observe a few complete duty cycles including both on and off transitions."
			question="How hard is the A/C working?"
			v-bind:clear="this.clearNormal"
			v-bind:observation="normalObservation"
			v-bind:observations="normalObservations"
			v-bind:observe="this.observeNormal"
		/>
	</div>
	<div>
		<page-header text="SuperCool" />
		<number-slider
			id="cooler-slider"
			v-bind:maximum="30"
			v-bind:minimum="10"
			question="What is the coldest permitted?"
			units="°C"
			v-model.number="minimumThermostat"
		/>
		<duty-cycle
			explanation="Please observe a few complete duty cycles including both on and off transitions."
			question="How hard is the A/C working?"
			v-bind:clear="this.clearCooler"
			v-bind:observation="coolerObservation"
			v-bind:observations="coolerObservations"
			v-bind:observe="this.observeCooler"
		/>
	</div>
	<div>
		<page-header text="Finish" />
		<div>Please reset the thermostat to {{ normalThermostat }}°C.</div>
		<div>You may also wish to download a copy of the data gathered today.</div>
		<tool-bar v-bind:download="this.stringifiedData" />
	</div>
</template>

<style scoped lang="scss">
:deep() {
	margin: 1.2rem;
	> * {
		display: block;
		margin: 0.6rem 0;
		width: 100%;
		> * {
			margin: 0.2rem 0;
		}
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
	coolerObservations: Array<ThermalInterval>;
	maximumThermostat: number;
	minimumThermostat: number;
	normalThermostat: number;
	normalObservations: Array<ThermalInterval>;
	phase: ObservationPhases;
}

interface ThermalObservationsState extends ThermalObservations {
	coolerObservation: CurrentObservation;
	error?: Error;
	normalObservation: CurrentObservation;
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
		Array.isArray(data.normalObservations) &&
		data.normalObservations.every(isThermalInterval) &&
		Array.isArray(data.coolerObservations) &&
		data.coolerObservations.every(isThermalInterval) &&
		Object.values(ObservationPhases).includes(data.phase) &&
		isDataSet(data) &&
		data.version === 0
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
			const { coolerObservation, error, normalObservation, ...cleansedData } = data;
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
		clearCooler: function (): void {
			this.clearObservation(this.$data.coolerObservation);
		},
		clearNormal: function (): void {
			this.clearObservation(this.$data.normalObservation);
		},
		clearObservation: function (observation: CurrentObservation): void {
			observation.endTime = undefined;
			observation.initialObservation = undefined;
			observation.startTime = undefined;
			observation.transitionTime = undefined;
		},
		clearError: function (): void {
			delete this.$data.error;
		},
		defaultData: function (
			data?: Partial<ThermalObservationsState>
		): ThermalObservationsState {
			return {
				coolerObservation: {
					initialObservation: undefined,
					startTime: undefined,
					transitionTime: undefined,
				},
				coolerObservations: [],
				maximumThermostat: 20,
				minimumThermostat: 14,
				normalThermostat: 18,
				normalObservation: {
					initialObservation: undefined,
					startTime: undefined,
					transitionTime: undefined,
				},
				normalObservations: [],
				phase: ObservationPhases.Normal,
				version: 0,
				...data,
			};
		},
		// TODO This *must* be in DutyCycle according to seperation of concerns and composition
		observe(isRisingEdge: boolean, observation: CurrentObservation, output: Array<ThermalInterval>, thermostat: number): void {
			const rightNow = Date.now();
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
				output.push({
					dutyCycle,
					endTemperature: thermostat,
					endTime: rightNow,
					startTemperature: thermostat,
					startTime: observation.startTime,
					thermostatSetting: thermostat,
				});
				observation.initialObservation = isRisingEdge;
				observation.startTime = rightNow;
				observation.transitionTime = undefined;
			}
		},
		observeCooler(isRisingEdge: boolean): void {
			this.observe(isRisingEdge, this.coolerObservation, this.coolerObservations, this.minimumThermostat);
		},
		observeNormal(isRisingEdge: boolean): void {
			this.observe(isRisingEdge, this.normalObservation, this.normalObservations, this.normalThermostat);
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
