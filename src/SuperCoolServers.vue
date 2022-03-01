<template>
	<!-- TODO Add icons to tab-bar -->
	<tab-bar v-bind:selections="Phases" v-model="phase" />
	<div class="main-pane">
		<text-page
			content="This is a web application for modelling the savings possible by proactively cooling a server room during off-peak tariffs. All data is stored and processed locally, on your computer, without use of any external data processors."
			header="SuperCool Servers"
			v-if="phase === Phases.Introduction"
			v-on:next="setPhase(Phases.Survey)"
		/>
		<thermal-survey
			v-else-if="phase === Phases.Survey"
			v-on:previous="setPhase(Phases.Introduction)"
			v-on:next="setPhase(Phases.Tariff)"
		/>
		<template v-else-if="phase === Phases.Tariff">
			<div>Tariff Data</div>
		</template>
	</div>
</template>

<style scoped lang="scss">
div.main-pane {
	background: var(--white);
	border-radius: 0 0 var(--medium-small) var(--medium-small);
	color: var(--black);
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: space-between;
}
div.main-pane:deep() {
	> div {
		padding-bottom: var(--small);
		padding-left: var(--medium);
		padding-right: var(--medium);
		padding-top: var(--small);
	}
	> div:first-child {
		padding-top: var(--medium);
	}
	> div:last-child {
		padding-bottom: var(--medium);
	}
	> div.spacer {
		flex-grow: 1;
		padding: 0;
	}
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import TabBar from "./components/TabBar.vue";
import TextPage from "./components/TextPage.vue";
import ThermalSurvey from "./components/ThermalSurvey.vue";

export enum Phases {
	Introduction = "Introduction",
	Survey = "Thermal Survey",
	Tariff = "Tariff Schedule",
}

export default defineComponent({
	components: {
		TabBar,
		TextPage,
		ThermalSurvey,
	},
	data() {
		return {
			phase: Phases.Introduction,
			Phases,
		};
	},
	methods: {
		setPhase(phase: Phases) {
			this.phase = phase;
		},
	},
});
</script>
