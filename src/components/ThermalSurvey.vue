<template>
	<div>
		<error-message
			v-if="this.error !== undefined"
			v-bind:on-clear="this.clearError"
		/>
		<tool-bar
			v-else
			v-bind:on-back="this.previousPhase"
			v-bind:on-clear="this.clearData"
			v-bind:on-next="this.nextPhase"
			v-bind:on-upload="this.uploadData"
			v-bind:download="this.stringifiedData"
		/>
	</div>
	<div>
		<page-header v-bind:text="this.phase" />
		<template v-if="this.phase === 'about'">
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
			<tool-bar
				v-bind:on-next="this.nextPhase"
				v-bind:on-back="this.previousPhase"
			/>
		</template>
		<template v-else-if="this.phase === 'normal'">
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
				v-bind:thermostat="this.normalThermostat"
				v-model="this.normalObservations"
			/>
			<tool-bar
				v-bind:on-next="this.nextPhase"
				v-bind:on-back="this.previousPhase"
			/>
		</template>
		<template v-else-if="this.phase === 'cooling'">
			<number-slider
				id="cooler-slider"
				v-bind:maximum="this.normalThermostat"
				v-bind:minimum="10"
				question="What is the coldest permitted?"
				units="°C"
				v-model.number="minimumThermostat"
			/>
			<tool-bar
				v-bind:on-next="this.nextPhase"
				v-bind:on-back="this.previousPhase"
			/>
		</template>
		<template v-else-if="this.phase === 'cooler'">
			<duty-cycle
				explanation="Please observe a few complete duty cycles including both on and off transitions."
				question="How hard is the A/C working?"
				v-bind:thermostat="this.minimumThermostat"
				v-model="this.coolerObservations"
			/>
			<tool-bar
				v-bind:on-next="this.nextPhase"
				v-bind:on-back="this.previousPhase"
			/>
		</template>
		<template v-else-if="this.phase === 'finish'">
			<div>Please reset the thermostat to {{ normalThermostat }}°C.</div>
			<div>
				You may also wish to download a copy of the data gathered today.
			</div>
			<tool-bar
				v-bind:on-back="this.previousPhase"
				v-bind:download="this.stringifiedData"
				v-bind:on-next="this.nextPhase"
			/>
		</template>
	</div>
</template>

<style scoped lang="scss">
:deep() {
	margin: 1.2rem;
	> * {
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
import DutyCycle, { ThermostaticObservation } from "./DutyCycle.vue";
import ErrorMessage from "./ErrorMessage.vue";
import NumberSlider from "./NumberSlider.vue";
import PageHeader from "./PageHeader.vue";
import ToolBar from "./ToolBar.vue";
import { DataSet, isDataSet } from "../types";

enum ObservationPhases {
	About = "about",
	Normal = "normal",
	Cooling = "cooling",
	Cooler = "cooler",
	Finish = "finish",
}

interface ThermalObservations extends DataSet {
	coolerObservations: Array<Partial<ThermostaticObservation>>;
	maximumThermostat: number;
	minimumThermostat: number;
	normalThermostat: number;
	normalObservations: Array<Partial<ThermostaticObservation>>;
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
		Array.isArray(data.normalObservations) &&
		Array.isArray(data.coolerObservations) &&
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
		stringifiedData(): string {
			return JSON.stringify(this.cleanseData(this.$data));
		},
	},
	components: { DutyCycle, ErrorMessage, NumberSlider, PageHeader, ToolBar },
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
			// TODO Should also remove partial observations
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { error, ...cleansedData } = data;
			if (!isThermalObservations(data)) {
				throw new DataParseError("Data not valid.");
			}
			return cleansedData;
		},
		clearData(): void {
			delete localStorage.thermalData;
			this.clearError();
			Object.assign(this, this.defaultData());
		},
		clearError(): void {
			delete this.$data.error;
		},
		defaultData(
			data?: Partial<ThermalObservationsState>
		): ThermalObservationsState {
			return {
				coolerObservations: [],
				error: undefined,
				maximumThermostat: 20,
				minimumThermostat: 14,
				normalThermostat: 18,
				normalObservations: [],
				phase: ObservationPhases.About,
				version: 0,
				...data,
			};
		},
		nextPhase(): void {
			if (this.$data.phase === ObservationPhases.About) {
				this.$data.phase = ObservationPhases.Normal;
			} else if (this.$data.phase === ObservationPhases.Normal) {
				this.$data.phase = ObservationPhases.Cooling;
			} else if (this.$data.phase === ObservationPhases.Cooling) {
				this.$data.phase = ObservationPhases.Cooler;
			} else if (this.$data.phase === ObservationPhases.Cooler) {
				this.$data.phase = ObservationPhases.Finish;
			}
		},
		previousPhase(): void {
			if (this.$data.phase === ObservationPhases.Finish) {
				this.$data.phase = ObservationPhases.Cooler;
			} else if (this.$data.phase === ObservationPhases.Cooler) {
				this.$data.phase = ObservationPhases.Cooling;
			} else if (this.$data.phase === ObservationPhases.Cooling) {
				this.$data.phase = ObservationPhases.Normal;
			} else if (this.$data.phase === ObservationPhases.Normal) {
				this.$data.phase = ObservationPhases.About;
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
				Object.assign(this, cleanedData);
			} catch (error) {
				console.error(error);
				this.$data.error = error;
			}
		},
	},
});
</script>
