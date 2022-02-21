<template>
	<error-message v-if="this.error !== undefined" v-on:clear="this.clearError" />
	<tool-bar
		v-else
		v-bind:disabled="this.disabledFunctions"
		v-bind:download="this.stringifiedData"
		v-on:clear="this.clearData"
		v-on:next="this.doNext"
		v-on:previous="this.doPrevious"
		v-on:upload="this.uploadData"
	/>
	<page-header v-bind:text="this.phase" />
	<template v-if="this.phase === 'thermal survey'">
		<div>
			During this, the thermal observations stage, we will gather data on how
			hard the air conditoner works to maintain a steady environment, what the
			limits are on acceptable thermostat settings and how quickly the room
			temperature changes.
		</div>
		<div>
			You will need to be able to observe whether the air conditioner is
			operating and adjust the thermostat settings.
		</div>
	</template>
	<template v-else-if="this.phase === 'normal'">
		<number-slider
			id="external-slider"
			v-bind:maximum="40"
			v-bind:minimum="-10"
			question="What is the outside temperature?"
			units="°C"
			v-model.number="externalTemperature"
		/>
		<number-slider
			id="current-slider"
			v-bind:maximum="30"
			v-bind:minimum="10"
			question="What is the thermostat set to?"
			units="°C"
			v-model.number="normalThermostat"
		/>
		<thermostatic-observation
			explanation="Please observe a few complete duty cycles including both on and off transitions."
			question="How hard is the A/C working?"
			v-bind:temperature="this.normalThermostat"
			v-model="this.observations"
		/>
	</template>
	<template v-else-if="this.phase === 'cooling'">
		<number-slider
			id="cooler-slider"
			v-bind:maximum="this.normalThermostat"
			v-bind:minimum="10"
			question="What is the coldest allowed?"
			units="°C"
			v-model.number="minimumThermostat"
		/>
		<thermodynamic-observation
			explanation="Please wait until the A/C has turned off, turn the thermostat down and time how long it takes to cool the room."
			question="How fast does the room cool?"
			v-bind:disabled="this.minimumThermostat >= this.normalThermostat"
			v-bind:end-temperature="this.minimumThermostat"
			v-bind:start-temperature="this.normalThermostat"
			v-model="this.observations"
		/>
	</template>
	<template v-else-if="this.phase === 'cooler'">
		<thermostatic-observation
			explanation="Please observe a few complete duty cycles including both on and off transitions."
			question="How hard is the A/C working?"
			v-bind:temperature="this.minimumThermostat"
			v-model="this.observations"
		/>
	</template>
	<template v-else-if="this.phase === 'resting'">
		<number-slider
			id="cooler-slider"
			v-bind:maximum="30"
			v-bind:minimum="this.normalThermostat"
			question="What is the warmest allowed?"
			units="°C"
			v-model.number="maximumThermostat"
		/>
		<thermodynamic-observation
			explanation="Please wait until the A/C has turned on, turn the thermostat up and time how long it takes the room to warm."
			question="How fast does the room warm?"
			v-bind:disabled="this.maximumThermostat <= this.minimumThermostat"
			v-bind:end-temperature="this.maximumThermostat"
			v-bind:start-temperature="this.minimumThermostat"
			v-model="this.observations"
		/>
	</template>
	<template v-else-if="this.phase === 'warmer'">
		<thermostatic-observation
			explanation="Please observe a few complete duty cycles including both on and off transitions."
			question="How hard is the A/C working?"
			v-bind:temperature="this.maximumThermostat"
			v-model="this.observations"
		/>
	</template>
	<template v-else-if="this.phase === 'finish'">
		<div>Please reset the thermostat to {{ normalThermostat }}°C.</div>
		<div>You may also wish to download a copy of the data gathered today.</div>
	</template>
	<div class="spacer"></div>
	<tool-bar
		v-if="this.phase === 'finish'"
		v-bind:disabled="this.disabledFunctions"
		v-bind:download="this.stringifiedData"
		v-on:next="this.doNext"
	/>
	<tool-bar
		v-else
		v-bind:disabled="this.disabledFunctions"
		v-on:next="this.doNext"
	/>
</template>

<style scoped lang="scss">
:deep() {
	> * {
		margin: var(--extra-small) 0;
		width: 100%;
	}
	> .section-header {
		font-size: var(--medium-large);
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
import ThermostaticObservation from "./ThermostaticObservation.vue";
import ThermodynamicObservation from "./ThermodynamicObservation.vue";
import { ThermalObservation, isThermalObservation } from "./DutyTable.vue";
import ErrorMessage from "./ErrorMessage.vue";
import NumberSlider from "./NumberSlider.vue";
import PageHeader from "./PageHeader.vue";
import ToolBar from "./ToolBar.vue";
import { DataSet, isDataSet } from "../types";

enum ObservationPhases {
	Introduction = "thermal survey",
	Normal = "normal",
	Cooling = "cooling",
	Cooler = "cooler",
	Resting = "resting",
	Warmer = "warmer",
	Finish = "finish",
}

interface ThermalObservations extends DataSet {
	externalTemperature: number;
	maximumThermostat: number;
	minimumThermostat: number;
	normalThermostat: number;
	observations: Array<Partial<ThermalObservation>>;
	phase: ObservationPhases;
}

interface ThermalObservationsState extends ThermalObservations {
	error?: unknown;
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
		disabledFunctions() {
			if (this.phase === ObservationPhases.Finish && !this.onNext) {
				return [this.doNext];
			} else if (
				this.phase === ObservationPhases.Introduction &&
				!this.onPrevious
			) {
				return [this.doPrevious];
			} else {
				return [];
			}
		},
		stringifiedData(): string {
			return JSON.stringify(this.cleanseData(this.$data));
		},
	},
	components: {
		ErrorMessage,
		NumberSlider,
		PageHeader,
		ThermodynamicObservation,
		ThermostaticObservation,
		ToolBar,
	},
	data(): ThermalObservationsState {
		if (localStorage.thermalData) {
			try {
				const rawData = JSON.parse(localStorage.thermalData);
				return this.defaultData(this.cleanseData(rawData));
			} catch (error) {
				localStorage.clear();
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
		cleanseData(data: ThermalObservationsState): ThermalObservations {
			// Drop transient properties
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { error, ...cleansedData } = data;
			cleansedData.observations =
				data.observations.filter(isThermalObservation);
			if (!isThermalObservations(data)) {
				throw new DataParseError("Data not valid.");
			}
			return cleansedData;
		},
		clearData(): void {
			delete localStorage.thermalData;
			this.clearError();
			Object.assign(this.$data, this.defaultData());
		},
		clearError(): void {
			delete this.$data.error;
		},
		defaultData(
			data?: Partial<ThermalObservationsState>
		): ThermalObservationsState {
			return {
				error: undefined,
				externalTemperature: 20,
				maximumThermostat: 20,
				minimumThermostat: 14,
				normalThermostat: 18,
				observations: [],
				phase: ObservationPhases.Introduction,
				version: 0,
				...data,
			};
		},
		// TODO Tidy incomplete observations on phase shift
		doNext(): void {
			Object.assign(this.$data, this.cleanseData(this.$data));
			if (this.phase === ObservationPhases.Introduction) {
				this.phase = ObservationPhases.Normal;
			} else if (this.phase === ObservationPhases.Normal) {
				this.phase = ObservationPhases.Cooling;
			} else if (this.phase === ObservationPhases.Cooling) {
				this.phase = ObservationPhases.Cooler;
			} else if (this.phase === ObservationPhases.Cooler) {
				this.phase = ObservationPhases.Resting;
			} else if (this.phase === ObservationPhases.Resting) {
				this.phase = ObservationPhases.Warmer;
			} else if (this.phase === ObservationPhases.Warmer) {
				this.phase = ObservationPhases.Finish;
			} else if (this.phase === ObservationPhases.Finish) {
				if (this.onNext) this.onNext();
			}
		},
		doPrevious(): void {
			Object.assign(this.$data, this.cleanseData(this.$data));
			if (this.phase === ObservationPhases.Finish) {
				this.phase = ObservationPhases.Warmer;
			} else if (this.phase === ObservationPhases.Warmer) {
				this.phase = ObservationPhases.Resting;
			} else if (this.phase === ObservationPhases.Resting) {
				this.phase = ObservationPhases.Cooler;
			} else if (this.phase === ObservationPhases.Cooler) {
				this.phase = ObservationPhases.Cooling;
			} else if (this.phase === ObservationPhases.Cooling) {
				this.phase = ObservationPhases.Normal;
			} else if (this.phase === ObservationPhases.Normal) {
				this.phase = ObservationPhases.Introduction;
			} else if (this.phase === ObservationPhases.Introduction) {
				if (this.onPrevious) this.onPrevious();
			}
		},
		saveData(): void {
			localStorage.thermalData = this.stringifiedData;
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
