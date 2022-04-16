<template>
	<error-message v-if="error !== undefined" v-on:clear="clearError" />
	<tool-bar
		v-else
		v-bind:download="stringified"
		v-on:clear="clearData"
		v-on:next="phaseShift(1)"
		v-on:previous="phaseShift(-1)"
		v-on:upload="upload"
	/>
	<page-header v-bind:text="data.phase" />
	<template v-if="data.phase === 'thermal survey'">
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
	<template v-else-if="data.phase === 'normal'">
		<number-slider
			id="external-slider"
			question="What is the outside temperature?"
			units="°C"
			v-bind:maximum="40"
			v-bind:minimum="-10"
			v-model.number="data.externalTemperature"
		/>
		<number-slider
			id="current-slider"
			question="What is the thermostat set to?"
			units="°C"
			v-bind:maximum="30"
			v-bind:minimum="10"
			v-model.number="data.normalThermostat"
		/>
		<thermostatic-observation
			explanation="Please observe a few complete duty cycles including both on and off transitions."
			question="How hard is the A/C working?"
			v-bind:temperature="data.normalThermostat"
			v-model="data.observations"
		/>
	</template>
	<template v-else-if="data.phase === 'cooling'">
		<number-slider
			id="cooler-slider"
			question="What is the coldest allowed?"
			units="°C"
			v-bind:maximum="data.normalThermostat"
			v-bind:minimum="10"
			v-model.number="data.minimumThermostat"
		/>
		<thermodynamic-observation
			explanation="Please wait until the A/C has turned off, turn the thermostat down and time how long it takes to cool the room."
			question="How fast does the room cool?"
			v-bind:disabled="data.minimumThermostat >= data.normalThermostat"
			v-bind:end-temperature="data.minimumThermostat"
			v-bind:start-temperature="data.normalThermostat"
			v-model="data.observations"
		/>
	</template>
	<template v-else-if="data.phase === 'cooler'">
		<thermostatic-observation
			explanation="Please observe a few complete duty cycles including both on and off transitions."
			question="How hard is the A/C working?"
			v-bind:temperature="data.minimumThermostat"
			v-model="data.observations"
		/>
	</template>
	<template v-else-if="data.phase === 'resting'">
		<number-slider
			id="cooler-slider"
			question="What is the warmest allowed?"
			units="°C"
			v-bind:maximum="30"
			v-bind:minimum="data.normalThermostat"
			v-model.number="data.maximumThermostat"
		/>
		<thermodynamic-observation
			explanation="Please wait until the A/C has turned on, turn the thermostat up and time how long it takes the room to warm."
			question="How fast does the room warm?"
			v-bind:disabled="data.maximumThermostat <= data.minimumThermostat"
			v-bind:end-temperature="data.maximumThermostat"
			v-bind:start-temperature="data.minimumThermostat"
			v-model="data.observations"
		/>
	</template>
	<template v-else-if="data.phase === 'warmer'">
		<thermostatic-observation
			explanation="Please observe a few complete duty cycles including both on and off transitions."
			question="How hard is the A/C working?"
			v-bind:temperature="data.maximumThermostat"
			v-model="data.observations"
		/>
	</template>
	<template v-else-if="data.phase === 'finish'">
		<div>Please reset the thermostat to {{ data.normalThermostat }}°C.</div>
		<div>You may also wish to download a copy of the data gathered today.</div>
	</template>
	<div class="spacer"></div>
	<tool-bar
		v-if="data.phase === 'finish'"
		v-bind:download="stringified"
		v-on:next="phaseShift(1)"
	/>
	<tool-bar v-else v-on:next="phaseShift(1)" />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ThermostaticObservation from "./ThermostaticObservation.vue";
import ThermodynamicObservation from "./ThermodynamicObservation.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import NumberSlider from "@/components/NumberSlider.vue";
import PageHeader from "@/components/PageHeader.vue";
import ToolBar from "@/components/ToolBar.vue";
import summariseObservations from "./ThermalSurvey.pipes";
import {
	SurveyPhases,
	ThermalSurveyState,
	isThermalSurveyState,
	padThermalSurveyState,
	isThermalInterval,
} from "./ThermalSurvey.types";
import useDataBoundary from "@/composables/useDataBoundary";
import { usePhases } from "@/components/TabBar.vue";

export default defineComponent({
	components: {
		ErrorMessage,
		NumberSlider,
		PageHeader,
		ThermodynamicObservation,
		ThermostaticObservation,
		ToolBar,
	},
	emits: {
		update: isThermalSurveyState,
	},
	props: {
		onNext: Function as PropType<() => void>,
		onPrevious: Function as PropType<() => void>,
	},
	setup: function (props, context) {
		const summariseSurvey = (thermalSurveyState: ThermalSurveyState) => {
			const observations = thermalSurveyState.observations;
			const fullObservations = observations.filter(isThermalInterval);
			return {
				...thermalSurveyState,
				...summariseObservations(fullObservations),
			};
		};
		const dataBoundary = useDataBoundary(
			"thermalSurvey",
			padThermalSurveyState,
			isThermalSurveyState,
			summariseSurvey,
			(thermalProperties) => context.emit("update", thermalProperties)
		);
		const phases = usePhases(
			[
				{ value: SurveyPhases.Introduction },
				{ value: SurveyPhases.Normal },
				{ value: SurveyPhases.Cooling },
				{ value: SurveyPhases.Cooler },
				{ value: SurveyPhases.Resting },
				{ value: SurveyPhases.Warmer },
				{ value: SurveyPhases.Finish },
			],
			dataBoundary,
			props.onPrevious,
			props.onNext,
			() => {
				const data = dataBoundary.data;
				data.observations = data.observations.filter(isThermalInterval);
			}
		);
		return { ...dataBoundary, ...phases };
	},
});
</script>
