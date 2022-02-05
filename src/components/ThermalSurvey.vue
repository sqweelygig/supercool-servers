<template>
	<error-message
		v-if="this.hasError"
		v-bind:error="error"
		v-bind:on-clear="this.clearError"
	/>
	<tool-ribbon
		v-else
		v-bind:on-clear="this.clearData"
		v-bind:on-next="this.nextPhase"
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
</template>

<style scoped lang="scss">
* {
	margin: 1rem;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import ErrorMessage from "./ErrorMessage.vue";
import NumberSlider from "./NumberSlider.vue";
import PageHeader from "./PageHeader.vue";
import ToolRibbon from "./ToolRibbon.vue";
import { ThermalInterval, DataSet } from "../types";

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
	error?: Error;
}

class DataParseError extends Error {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isThermalObservations(data: any): data is ThermalObservations {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.maximumThermostat === "number" &&
		data.maximumThermostat >= 10 &&
		data.maximumThermostat <= 30 &&
		typeof data.minimumThermostat === "number" &&
		data.minimumThermostat >= 10 &&
		data.minimumThermostat <= 30 &&
		typeof data.normalThermostat === "number" &&
		data.normalThermostat >= 10 &&
		data.normalThermostat <= 30 &&
		data.minimumThermostat <= data.normalThermostat <= data.maximumThermostat &&
		Array.isArray(data.observations) &&
		Object.values(ObservationPhases).includes(data.phase) &&
		data.version === 1
	);
}

export default defineComponent({
	created(): void {
		for (const key in this.$data) {
			this.$watch(key, this.saveData);
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
	components: { ErrorMessage, NumberSlider, PageHeader, ToolRibbon },
	data(): ThermalObservationsState {
		if (localStorage.thermalData) {
			try {
				return this.parseData(localStorage.thermalData);
			} catch (error) {
				return this.defaultData({
					error: new Error("Could not load previous state."),
				});
			}
		} else {
			return this.defaultData();
		}
	},
	methods: {
		cleanseData: function (data: ThermalObservationsState) : ThermalObservations {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { error, ...cleansedData } = data; // Omit error property
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
		clearError: function (): void {
			delete this.$data.error;
		},
		defaultData: function (
			data?: Partial<ThermalObservationsState>
		): ThermalObservationsState {
			return {
				maximumThermostat: 20,
				minimumThermostat: 14,
				normalThermostat: 18,
				observations: [],
				phase: ObservationPhases.Normal,
				version: 1,
				...data,
			};
		},
		nextPhase: function (): void {
			this.phase = ObservationPhases.Normal;
		},
		saveData: function (): void {
			localStorage.thermalData = this.stringifiedData;
		},
		uploadData: function (data: string): void {
			try {
				this.clearError();
				Object.assign(this, this.cleanseData(JSON.parse(data)));
			} catch (error) {
				this.$data.error = new Error("Data upload failed.");
			}
		},
	},
	name: "Thermal Survey",
});
</script>
