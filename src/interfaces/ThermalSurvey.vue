<template>
	<error-message v-if="error !== undefined" v-on:clear="clearError" />
	<tool-bar
		v-else
		v-bind:download="stringifiedData"
		v-on:clear="clearData"
		v-on:next="doNext"
		v-on:previous="doPrevious"
		v-on:upload="uploadData"
	/>
	<page-header v-bind:text="phase" />
	<template v-if="phase === 'thermal survey'">
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
	<template v-else-if="phase === 'normal'">
		<number-slider
			id="external-slider"
			question="What is the outside temperature?"
			units="°C"
			v-bind:maximum="40"
			v-bind:minimum="-10"
			v-model.number="externalTemperature"
		/>
		<number-slider
			id="current-slider"
			question="What is the thermostat set to?"
			units="°C"
			v-bind:maximum="30"
			v-bind:minimum="10"
			v-model.number="normalThermostat"
		/>
		<thermostatic-observation
			explanation="Please observe a few complete duty cycles including both on and off transitions."
			question="How hard is the A/C working?"
			v-bind:temperature="normalThermostat"
			v-model="observations"
		/>
	</template>
	<template v-else-if="phase === 'cooling'">
		<number-slider
			id="cooler-slider"
			question="What is the coldest allowed?"
			units="°C"
			v-bind:maximum="normalThermostat"
			v-bind:minimum="10"
			v-model.number="minimumThermostat"
		/>
		<thermodynamic-observation
			explanation="Please wait until the A/C has turned off, turn the thermostat down and time how long it takes to cool the room."
			question="How fast does the room cool?"
			v-bind:disabled="minimumThermostat >= normalThermostat"
			v-bind:end-temperature="minimumThermostat"
			v-bind:start-temperature="normalThermostat"
			v-model="observations"
		/>
	</template>
	<template v-else-if="phase === 'cooler'">
		<thermostatic-observation
			explanation="Please observe a few complete duty cycles including both on and off transitions."
			question="How hard is the A/C working?"
			v-bind:temperature="minimumThermostat"
			v-model="observations"
		/>
	</template>
	<template v-else-if="phase === 'resting'">
		<number-slider
			id="cooler-slider"
			question="What is the warmest allowed?"
			units="°C"
			v-bind:maximum="30"
			v-bind:minimum="normalThermostat"
			v-model.number="maximumThermostat"
		/>
		<thermodynamic-observation
			explanation="Please wait until the A/C has turned on, turn the thermostat up and time how long it takes the room to warm."
			question="How fast does the room warm?"
			v-bind:disabled="maximumThermostat <= minimumThermostat"
			v-bind:end-temperature="maximumThermostat"
			v-bind:start-temperature="minimumThermostat"
			v-model="observations"
		/>
	</template>
	<template v-else-if="phase === 'warmer'">
		<thermostatic-observation
			explanation="Please observe a few complete duty cycles including both on and off transitions."
			question="How hard is the A/C working?"
			v-bind:temperature="maximumThermostat"
			v-model="observations"
		/>
	</template>
	<template v-else-if="phase === 'finish'">
		<div>Please reset the thermostat to {{ normalThermostat }}°C.</div>
		<div>You may also wish to download a copy of the data gathered today.</div>
	</template>
	<div class="spacer"></div>
	<tool-bar
		v-if="phase === 'finish'"
		v-bind:download="stringifiedData"
		v-on:next="doNext"
	/>
	<tool-bar v-else v-on:next="doNext" />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ThermostaticObservation from "@/components/ThermostaticObservation.vue";
import ThermodynamicObservation from "@/components/ThermodynamicObservation.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import NumberSlider from "@/components/NumberSlider.vue";
import PageHeader from "@/components/PageHeader.vue";
import ToolBar from "@/components/ToolBar.vue";
import summariseObservations from "@/pipes/SummariseObservations";
import {
	DataSet,
	isDataSet,
	ThermalInterval,
	isThermalInterval,
	ThermalProperties,
} from "@/types/SuperCoolServers.types";
import { DataParseError } from "@/composables/useLocalStorage";

enum SurveyPhases {
	Introduction = "thermal survey",
	Normal = "normal",
	Cooling = "cooling",
	Cooler = "cooler",
	Resting = "resting",
	Warmer = "warmer",
	Finish = "finish",
}

interface ThermalSurveyState extends DataSet {
	error?: unknown;
	externalTemperature: number;
	maximumThermostat: number;
	minimumThermostat: number;
	normalThermostat: number;
	observations: Array<Partial<ThermalInterval>>;
	phase: SurveyPhases;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isThermalSurveyState(data: any): data is ThermalSurveyState {
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.externalTemperature === "number" &&
		typeof data.maximumThermostat === "number" &&
		typeof data.minimumThermostat === "number" &&
		typeof data.normalThermostat === "number" &&
		Array.isArray(data.observations) &&
		data.observations.every(isThermalInterval) &&
		Object.values(SurveyPhases).includes(data.phase) &&
		isDataSet(data) &&
		data.version === 0
	);
}

export default defineComponent({
	created(): void {
		const emit = () => this.onUpdate?.(this.thermalProperties);
		for (const key in this.$data) {
			this.$watch(key, this.saveData, { deep: true });
			this.$watch(key, emit, { deep: true });
		}
		emit();
	},
	computed: {
		stringifiedData(): string {
			return JSON.stringify(this.cleanseData(this.$data));
		},
		thermalProperties(): ThermalProperties {
			const fullObservations = this.observations.filter(isThermalInterval);
			return {
				maximumThermostat: this.maximumThermostat,
				minimumThermostat: this.minimumThermostat,
				normalThermostat: this.normalThermostat,
				...summariseObservations(fullObservations),
			};
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
	data(): ThermalSurveyState {
		if (localStorage.thermalData) {
			try {
				const rawData = JSON.parse(localStorage.thermalData);
				return this.defaultData(this.cleanseData(rawData));
			} catch (error) {
				delete localStorage.thermalData;
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
		cleanseData(data: ThermalSurveyState): ThermalSurveyState {
			// Drop transient properties
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { error, ...cleansedData } = data;
			cleansedData.observations = data.observations.filter(isThermalInterval);
			if (!isThermalSurveyState(data)) {
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
		defaultData(data?: Partial<ThermalSurveyState>): ThermalSurveyState {
			return {
				error: undefined,
				externalTemperature: 20,
				maximumThermostat: 20,
				minimumThermostat: 14,
				normalThermostat: 18,
				observations: [],
				phase: SurveyPhases.Introduction,
				version: 0,
				...data,
			};
		},
		doNext(): void {
			Object.assign(this.$data, this.cleanseData(this.$data));
			if (this.phase === SurveyPhases.Introduction) {
				this.phase = SurveyPhases.Normal;
			} else if (this.phase === SurveyPhases.Normal) {
				this.phase = SurveyPhases.Cooling;
			} else if (this.phase === SurveyPhases.Cooling) {
				this.phase = SurveyPhases.Cooler;
			} else if (this.phase === SurveyPhases.Cooler) {
				this.phase = SurveyPhases.Resting;
			} else if (this.phase === SurveyPhases.Resting) {
				this.phase = SurveyPhases.Warmer;
			} else if (this.phase === SurveyPhases.Warmer) {
				this.phase = SurveyPhases.Finish;
			} else if (this.phase === SurveyPhases.Finish) {
				this.onNext?.();
			}
		},
		doPrevious(): void {
			Object.assign(this.$data, this.cleanseData(this.$data));
			if (this.phase === SurveyPhases.Finish) {
				this.phase = SurveyPhases.Warmer;
			} else if (this.phase === SurveyPhases.Warmer) {
				this.phase = SurveyPhases.Resting;
			} else if (this.phase === SurveyPhases.Resting) {
				this.phase = SurveyPhases.Cooler;
			} else if (this.phase === SurveyPhases.Cooler) {
				this.phase = SurveyPhases.Cooling;
			} else if (this.phase === SurveyPhases.Cooling) {
				this.phase = SurveyPhases.Normal;
			} else if (this.phase === SurveyPhases.Normal) {
				this.phase = SurveyPhases.Introduction;
			} else if (this.phase === SurveyPhases.Introduction) {
				this.onPrevious?.();
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
		onNext: Function as PropType<() => void>,
		onPrevious: Function as PropType<() => void>,
		onUpdate: Function as PropType<(data: ThermalProperties) => void>,
	},
});
</script>
