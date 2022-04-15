<template>
	<tab-bar v-bind:options="phases" v-model="data.phase" />
	<div class="main-pane">
		<text-page
			v-if="data.phase === 'introduction'"
			v-bind:content="[
				'This web application models the savings possible by proactively cooling a server room during off-peak tariffs.',
				[
					'It applies some simplifying assumptions to its thermal model, which are reasonable for some server rooms.',
					'Firstly, The model assumes that air conditioning units perform most of the cooling.',
					'Furthermore, it assumes that the servers are the primary heat source and that this is constant.',
					'Finally, it assumes that heat propagation within the room is instant.',
					'Further development may occur to eliminate these simplifications.',
					'You are responsible for judging whether they are reasonable in your situation.',
				].join(' '),
				'All data is stored and processed locally, on your computer, without any external data processors.',
			]"
			header="SuperCool Servers"
			v-on:next="phaseShift(1)"
		/>
		<thermal-survey
			v-else-if="data.phase === 'survey'"
			v-on:next="phaseShift(1)"
			v-on:previous="phaseShift(-1)"
			v-on:update="setThermalProperties"
		/>
		<tariff-schedule
			v-else-if="data.phase === 'tariff'"
			v-on:previous="phaseShift(-1)"
			v-on:update="setTariffSchedule"
		/>
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
	DataSet,
	isDataSet,
	ThermalProperties,
	isThermalProperties,
} from "@/types/SuperCoolServers.types";
import { defineComponent } from "vue";
import TabBar, { usePhases } from "@/components/TabBar.vue";
import TariffSchedule from "@/tariff-schedule/TariffSchedule.vue";
import {
	TariffInterval,
	isTariffInterval,
} from "@/tariff-schedule/TariffSchedule.types";
import TextPage from "@/interfaces/TextPage.vue";
import ThermalSurvey from "@/interfaces/ThermalSurvey.vue";
import useLocalStorage from "@/composables/useLocalStorage";

enum Phases {
	Introduction = "introduction",
	Survey = "survey",
	Tariff = "tariff",
}

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

interface SuperCoolServersState extends DataSet {
	phase: Phases;
	tariffSchedule?: TariffInterval[];
	thermalProperties?: ThermalProperties;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSuperCoolServersState(data: any): data is SuperCoolServersState {
	const tariffs = data.tariffSchedule;
	const properties = data.thermalProperties;
	return (
		typeof data === "object" &&
		data !== null &&
		typeof data.phase === "string" &&
		Object.values(Phases).includes(data.phase) &&
		(tariffs === undefined || tariffs.every(isTariffInterval)) &&
		(properties === undefined || isThermalProperties(properties)) &&
		isDataSet(data) &&
		data.version === 0
	);
}

function padSuperCoolServersState(
	data: Partial<SuperCoolServersState>
): SuperCoolServersState {
	return {
		phase: Phases.Introduction,
		tariffSchedule: undefined,
		thermalProperties: undefined,
		version: 0,
		...data,
	};
}

export default defineComponent({
	components: {
		TabBar,
		TariffSchedule,
		TextPage,
		ThermalSurvey,
	},
	setup: function () {
		const store = useLocalStorage(
			"superCoolServers",
			padSuperCoolServersState,
			isSuperCoolServersState,
			() => null,
			// TODO Handle top-level import errors by making a landing page component
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
