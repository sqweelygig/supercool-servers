<template>
	<tab-bar v-bind:options="phases" v-model="data.phase" />
	<div class="main-pane">
		<thermal-survey
			v-if="data.phase === 'survey'"
			v-on:next="phaseShift(1)"
			v-on:previous="phaseShift(-1)"
			v-on:update="setThermalProperties"
		/>
		<tariff-survey
			v-else-if="data.phase === 'tariff'"
			v-on:next="phaseShift(1)"
			v-on:previous="phaseShift(-1)"
			v-on:update="setTariffSchedule"
		/>
		<chart-output
			v-else-if="
				data.phase === 'chart' &&
				data.tariffSchedule !== undefined &&
				data.thermalProperties !== undefined
			"
			v-on:previous="phaseShift(-1)"
			v-bind:tariff-schedule="data.tariffSchedule"
			v-bind:thermal-properties="data.thermalProperties"
		/>
		<introduction v-else v-on:next="phaseShift(1)" />
	</div>
</template>

<style scoped lang="scss">
.main-pane {
	background: var(--white);
	border-radius: 0 0 var(--medium-small) var(--medium-small);
	color: var(--black);
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: space-between;
}
.main-pane:deep() {
	> * {
		margin-bottom: var(--extra-small);
		margin-left: var(--medium);
		margin-right: var(--medium);
		margin-top: var(--extra-small);
		> * {
			margin: var(--extra-small) 0;
			width: 100%;
		}
		> :first-child {
			margin-top: 0;
		}
		> :last-child {
			margin-bottom: 0;
		}
	}
	> :first-child {
		margin-top: var(--medium);
	}
	> :last-child {
		margin-bottom: var(--medium);
	}
	.section-header {
		font-size: var(--medium-large);
	}
	> .tool-bar {
		> * {
			margin: 0;
		}
	}
}
</style>

<script lang="ts">
import {
	padSuperCoolServersState,
	isSuperCoolServersState,
	Phases,
} from "./SuperCoolServers.types";
import { defineComponent } from "vue";
import TabBar, { usePhases } from "@/components/TabBar.vue";
import TariffSurvey from "@/tariff-survey/TariffSurvey.vue";
import { TariffSchedule } from "@/tariff-survey/TariffSurvey.types";
import { ThermalProperties } from "@/thermal-survey/ThermalSurvey.types";
import ThermalSurvey from "@/thermal-survey/ThermalSurvey.vue";
import useDataBoundary from "@/composables/useDataBoundary";
import ChartOutput from "@/chart-output/ChartOutput.vue";
import Introduction from "@/introduction/Introduction.vue";

const phases = [
	{
		icon: "info-circle",
		text: "Introduction",
		value: Phases.Introduction,
	},
	{
		icon: "thermometer-half",
		text: "Survey",
		value: Phases.Survey,
	},
	{ icon: "money-bill", text: "Tariffs", value: Phases.Tariff },
	{ icon: "chart-line", text: "Chart", value: Phases.Chart },
];

export default defineComponent({
	components: {
		TabBar,
		TariffSurvey,
		ThermalSurvey,
		ChartOutput,
		Introduction,
	},
	setup: function () {
		const store = useDataBoundary(
			"superCoolServers",
			padSuperCoolServersState,
			isSuperCoolServersState,
			// Swallow value conversion
			() => null,
			// Swallow value emission
			() => null
		);
		const setTariffSchedule = (schedule: TariffSchedule) => {
			store.data.tariffSchedule = schedule;
		};
		const setThermalProperties = (properties: ThermalProperties) => {
			store.data.thermalProperties = properties;
		};
		return {
			setTariffSchedule,
			setThermalProperties,
			...usePhases(phases, store),
			...store,
		};
	},
});
</script>
