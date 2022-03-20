<template>
	<tab-bar v-bind:options="phaseTabs" v-model="phase" />
	<div class="main-pane">
		<text-page
			v-if="phase === 'introduction'"
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
			v-on:next="doNext"
		/>
		<thermal-survey
			v-else-if="phase === 'survey'"
			v-on:next="doNext"
			v-on:previous="doPrevious"
			v-on:update="setThermalProperties"
		/>
		<tariff-schedule
			v-else-if="phase === 'tariff'"
			v-on:previous="doPrevious"
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
	DataParseError,
	DataSet,
	isDataSet,
	TariffInterval,
	isTariffInterval,
	ThermalProperties,
	isThermalProperties,
} from "@/types/SuperCoolServers.types";
import { defineComponent } from "vue";
import TabBar from "./components/TabBar.vue";
import TariffSchedule from "./interfaces/TariffSchedule.vue";
import TextPage from "./interfaces/TextPage.vue";
import ThermalSurvey from "./interfaces/ThermalSurvey.vue";

enum Phases {
	Introduction = "introduction",
	Survey = "survey",
	Tariff = "tariff",
}

interface SuperCoolServersState extends DataSet {
	error?: unknown;
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

export default defineComponent({
	components: {
		TabBar,
		TariffSchedule,
		TextPage,
		ThermalSurvey,
	},
	computed: {
		phaseTabs() {
			return [
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
		},
		stringifiedData(): string {
			return JSON.stringify(this.cleanseData(this.$data));
		},
	},
	created(): void {
		for (const key in this.$data) {
			this.$watch(key, this.saveData, { deep: true });
		}
	},
	data(): SuperCoolServersState {
		if (localStorage.superCoolServers) {
			try {
				const rawData = JSON.parse(localStorage.superCoolServers);
				return this.defaultData(this.cleanseData(rawData));
			} catch (error) {
				delete localStorage.superCoolServers;
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
		cleanseData(data: SuperCoolServersState): SuperCoolServersState {
			if (!isSuperCoolServersState(data)) {
				throw new DataParseError("Data not valid.");
			}
			return data;
		},
		defaultData(data: Partial<SuperCoolServersState>): SuperCoolServersState {
			return {
				error: undefined,
				phase: Phases.Introduction,
				tariffSchedule: undefined,
				thermalProperties: undefined,
				version: 0,
				...data,
			};
		},
		doNext() {
			if (this.phase === Phases.Introduction) {
				this.phase = Phases.Survey;
			} else if (this.phase === Phases.Survey) {
				this.phase = Phases.Tariff;
			}
		},
		doPrevious() {
			if (this.phase === Phases.Survey) {
				this.phase = Phases.Introduction;
			} else if (this.phase === Phases.Tariff) {
				this.phase = Phases.Survey;
			}
		},
		saveData(): void {
			localStorage.superCoolServers = this.stringifiedData;
		},
		setPhase(phase: Phases) {
			this.phase = phase;
		},
		setTariffSchedule(schedule: TariffInterval[]) {
			this.tariffSchedule = schedule;
		},
		setThermalProperties(properties: ThermalProperties) {
			this.thermalProperties = properties;
		},
	},
});
</script>
