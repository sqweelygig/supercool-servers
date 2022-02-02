<template>
	<tool-ribbon
		v-bind:on-clear="this.clearData"
		v-bind:on-next="this.nextPhase"
		v-bind:on-upload="this.uploadData"
		v-bind:download="this.downloadData"
	/>
	<error-message v-if="this.hasError" v-bind:error="error" />
	<page-header text="Normal operation" />
	<number-slider
		label="Current"
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

interface Interval {
	endTime: number;
	startTime: number;
}

interface ThermostatInterval extends Interval {
	thermostatSetting: number;
}

interface ThermalInterval extends ThermostatInterval {
	startTemperature: number;
	endTemperature: number;
	dutyCycle: number;
}

export interface ThermalProperties {
	baseloadDutyCycle: number;
	temperatureChangeVelocity: number;
	maximumThermostat: number;
	minimumThermostat: number;
	normalThermostat: number;
	version: number;
}

interface ThermalObservations {
	maximumThermostat: number;
	minimumThermostat: number;
	normalThermostat: number;
	observations: Array<ThermalInterval>;
	phase: string; // TODO This should eventually be an enum
	version: number;
}

type ThermalObservationsState = ThermalObservations & { error?: string };

class DataParseError extends Error {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isThermalObservations(data: any): data is ThermalObservations {
	const phases = ["intro", "normal", "warmer", "cooler", "reset", "complete"];
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
		phases.includes(data.phase) &&
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
		downloadData: function (): string {
			return this.stringifyData(this.$data);
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
					error: "Could not load previous state.",
				});
			}
		} else {
			return this.defaultData();
		}
	},
	methods: {
		clearData: function (): void {
			delete localStorage.thermalData;
			Object.assign(this, this.defaultData());
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
				phase: "normal",
				version: 1,
				...data,
			};
		},
		nextPhase: function (): void {
			this.phase = "normal";
		},
		parseData: function (data: string): ThermalObservations {
			const parsedData: unknown = JSON.parse(data);
			// Step the data up the versions (currently 1, so nothing here)
			if (!isThermalObservations(parsedData)) {
				throw new DataParseError("Data not valid.");
			}
			return parsedData;
		},
		saveData: function (): void {
			localStorage.thermalData = this.stringifyData(this.$data);
		},
		stringifyData: function (data: ThermalObservationsState): string {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { error, ...returnValue } = data; // Omit error property
			return JSON.stringify(returnValue);
		},
		uploadData: function (data: string): void {
			try {
				Object.assign(this, this.parseData(data));
				delete this.$data.error;
			} catch (error) {
				this.$data.error = "Data upload failed.";
			}
		},
	},
	name: "Thermal Survey",
});
</script>
