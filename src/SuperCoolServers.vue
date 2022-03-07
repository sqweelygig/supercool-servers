<template>
	<tab-bar v-bind:options="orderedPhases" v-model="phase" />
	<div class="main-pane">
		<text-page
			v-if="phase === indexedPhases.introduction"
			content="This is a web application for modelling the savings possible by proactively cooling a server room during off-peak tariffs. All data is stored and processed locally, on your computer, without use of any external data processors."
			header="SuperCool Servers"
			v-on:next="setPhase(indexedPhases.survey)"
		/>
		<thermal-survey
			v-else-if="phase === indexedPhases.survey"
			v-on:next="setPhase(indexedPhases.tariff)"
			v-on:previous="setPhase(indexedPhases.introduction)"
			v-on:update="log"
		/>
		<tariff-schedule
			v-else-if="phase === indexedPhases.tariff"
			v-on:previous="setPhase(indexedPhases.survey)"
			v-on:update="log"
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
import { defineComponent } from "vue";
import TabBar, { TabItem } from "./components/TabBar.vue";
import TariffSchedule from "./interfaces/TariffSchedule.vue";
import TextPage from "./interfaces/TextPage.vue";
import ThermalSurvey from "./interfaces/ThermalSurvey.vue";

export default defineComponent({
	components: {
		TabBar,
		TariffSchedule,
		TextPage,
		ThermalSurvey,
	},
	data() {
		const indexedPhases = {
			introduction: { icon: "info-circle", text: "Introduction" },
			survey: { icon: "thermometer-half", text: "Thermal Survey" },
			tariff: { icon: "money-bill", text: "Tariff Schedule" },
		};
		const orderedPhases = [
			indexedPhases.introduction,
			indexedPhases.survey,
			indexedPhases.tariff,
		];
		return {
			indexedPhases,
			orderedPhases,
			phase: indexedPhases.introduction,
		};
	},
	methods: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		log(value: any) {
			console.log(value);
		},
		setPhase(phase: TabItem) {
			this.phase = phase;
		},
	},
});
</script>
