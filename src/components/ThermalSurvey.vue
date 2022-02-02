<template>
	<tool-ribbon
		v-bind:on-clear="this.clearData"
		v-bind:on-next="this.nextPhase"
		v-bind:on-upload="this.uploadData"
		v-bind:download="this.downloadData"
	/>
	<page-header text="Normal operation" />
	<number-slider
		label="Current"
		maximum="30"
		minimum="10"
		question="What is the thermostat set to?"
		units="°C"
		v-model.number="normalThermostat"
	/>
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
	phase: "intro" | "normal" | "cooler" | "warmer" | "reset" | "complete";
	version: number;
}

class DataParseError extends Error {}

export default defineComponent({
	created(): void {
		for (const key in this.$data) {
			this.$watch(key, this.saveData);
		}
	},
	computed: {
		downloadData: function (): string {
			return JSON.stringify(this.$data);
		},
	},
	components: { ToolRibbon, PageHeader, NumberSlider },
	data(): ThermalObservations {
		if (localStorage.thermalData) {
			return this.parseData(localStorage.thermalData);
		} else {
			return this.defaultData();
		}
	},
	methods: {
		clearData: function (): void {
			delete localStorage.thermalData;
			Object.assign(this, this.defaultData());
		},
		defaultData: function (): ThermalObservations {
			return {
				maximumThermostat: 20,
				minimumThermostat: 14,
				normalThermostat: 18,
				observations: [],
				phase: "normal",
				version: 1,
			};
		},
		nextPhase: function (): void {
			this.phase = "normal";
		},
		parseData: function (data: string): ThermalObservations {
			// TODO Add error feedback to template
			const parsedData = JSON.parse(data);
			// Step the data up the versions (currently 1, so nothing here)
			// Validate the data according to the current standards
			if (
				typeof parsedData.maximumThermostat !== "number" ||
				parsedData.maximumThermostat < 10 ||
				parsedData.maximumThermostat > 30
			) {
				throw new DataParseError("Invalid value for maximum thermostat.");
			}
			if (
				typeof parsedData.minimumThermostat !== "number" ||
				parsedData.minimumThermostat < 10 ||
				parsedData.minimumThermostat > 30
			) {
				throw new DataParseError("Invalid value for minimum thermostat.");
			}
			if (
				typeof parsedData.normalThermostat !== "number" ||
				parsedData.normalThermostat < 10 ||
				parsedData.normalThermostat > 30
			) {
				throw new DataParseError("Invalid value for normal thermostat.");
			}
			if (!Array.isArray(parsedData.observations)) {
				throw new DataParseError("Invalid value for observations.");
			}
			const phases = [
				"intro",
				"normal",
				"warmer",
				"cooler",
				"reset",
				"complete",
			];
			if (!phases.includes(parsedData.phase)) {
				throw new DataParseError("Invalid value for phase.");
			}
			if (parsedData.version !== 1) {
				throw new DataParseError("Invalid value for version.");
			}
			return parsedData;
		},
		saveData: function (): void {
			localStorage.thermalData = JSON.stringify(this.$data);
		},
		uploadData: function (data: string): void {
			Object.assign(this, this.parseData(data));
		},
	},
	name: "Thermal Survey",
});
</script>
