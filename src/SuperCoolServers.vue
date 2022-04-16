<template>
	<tab-bar v-bind:options="phases" v-model="data.phase" />
	<div class="main-pane">
		<thermal-survey
			v-if="data.phase === 'survey'"
			v-on:next="phaseShift(1)"
			v-on:previous="phaseShift(-1)"
			v-on:update="setThermalProperties"
		/>
		<tariff-schedule
			v-else-if="data.phase === 'tariff'"
			v-on:previous="phaseShift(-1)"
			v-on:update="setTariffSchedule"
		/>
		<template v-else>
			<error-message v-if="error !== undefined" v-on:clear="clearError" />
			<page-header v-else text="SuperCool Servers" />
			<div>
				This web application models the savings possible by proactively cooling
				a server room during off-peak tariffs.
			</div>
			<div>
				It applies some simplifying assumptions to its thermal model, which are
				reasonable for some server rooms. Firstly, The model assumes that air
				conditioning units perform most of the cooling. Furthermore, it assumes
				that the servers are the primary heat source and that this is constant.
				Finally, it assumes that heat propagation within the room is instant.
				Further development may occur to eliminate these simplifications. You
				are responsible for judging whether they are reasonable in your
				situation.
			</div>
			<div>
				All data is stored and processed locally, on your computer, without any
				external data processors.
			</div>
			<div class="spacer"></div>
			<tool-bar v-on:next="phaseShift(1)" />
		</template>
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
		padding-bottom: var(--small);
		padding-left: var(--medium);
		padding-right: var(--medium);
		padding-top: var(--small);
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
		padding-top: var(--medium);
	}
	> :last-child {
		padding-bottom: var(--medium);
	}
	> .spacer {
		flex-grow: 1;
		padding: 0;
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
import TariffSchedule from "@/tariff-schedule/TariffSchedule.vue";
import { TariffInterval } from "@/tariff-schedule/TariffSchedule.types";
import { ThermalProperties } from "@/thermal-survey/ThermalSurvey.types";
import ThermalSurvey from "@/thermal-survey/ThermalSurvey.vue";
import useDataBoundary from "@/composables/useDataBoundary";

const phases = [
	{
		icon: "info-circle",
		text: "Introduction",
		value: Phases.Introduction,
	},
	{
		icon: "thermometer-half",
		text: "Thermal Survey",
		value: Phases.Survey,
	},
	{ icon: "money-bill", text: "Tariff Schedule", value: Phases.Tariff },
];

export default defineComponent({
	components: {
		TabBar,
		TariffSchedule,
		ThermalSurvey,
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
		const setTariffSchedule = (schedule: TariffInterval[]) => {
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
