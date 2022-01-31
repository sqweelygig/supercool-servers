<template>
	<tool-ribbon
		v-bind:on-clear="this.clearData"
		v-bind:on-next="this.nextPhase"
		v-bind:on-upload="this.uploadData"
		v-bind:download="this.downloadData"
	/>
	<div id="heading">
		<h1>Thermostat settings</h1>
	</div>
	<div id="main-content" v-if="phase === 'initial'">
		<div>
			<div>
				<label for="min-temp">
					Minimum:
					<output for="min-temp">{{ minimumThermostat }}°C</output>
				</label>
			</div>
			<!-- TODO Style these range inputs onto colour scheme -->
			<input
				type="range"
				id="min-temp"
				min="10"
				max="30"
				step="1"
				v-model.number="minimumThermostat"
			/>
		</div>
		<div>
			<div>
				<label for="normal-temp">
					Current:
					<output for="normal-temp">{{ normalThermostat }}°C</output>
				</label>
			</div>
			<input
				type="range"
				id="normal-temp"
				min="10"
				max="30"
				step="1"
				v-model.number="normalThermostat"
			/>
		</div>
		<div>
			<div>
				<label for="max-temp">
					Maximum:
					<output for="max-temp">{{ maximumThermostat }}°C</output>
				</label>
			</div>
			<input
				type="range"
				id="max-temp"
				min="10"
				max="30"
				step="1"
				v-model.number="maximumThermostat"
			/>
		</div>
	</div>
</template>

<style scoped lang="scss">
#main-content {
	> div {
		min-width: 15rem;
	}
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
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
	phase: "initial" | "normal" | "cooling" | "cooler" | "warming" | "complete";
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
	components: { ToolRibbon },
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
				phase: "initial",
				version: 1,
			};
		},
		nextPhase: function (): void {
			this.phase = "normal";
		},
		parseData: function (data: string): ThermalObservations {
			// TODO Add error feedback to template
			const parsedData = JSON.parse(data);
			// Convert the data up the versions (currently 1)
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
			if (!["initial"].includes(parsedData.phase)) {
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
