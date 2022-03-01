<template>
	<tab-bar v-bind:selections="orderedPhases" v-model="phase" />
	<div class="main-pane">
		<text-page
			content="This is a web application for modelling the savings possible by proactively cooling a server room during off-peak tariffs. All data is stored and processed locally, on your computer, without use of any external data processors."
			header="SuperCool Servers"
			v-if="phase === indexedPhases.introduction"
			v-on:next="setPhase(indexedPhases.survey)"
		/>
		<thermal-survey
			v-else-if="phase === indexedPhases.survey"
			v-on:previous="setPhase(indexedPhases.introduction)"
			v-on:next="setPhase(indexedPhases.tariff)"
		/>
		<template v-else-if="phase === indexedPhases.tariff">
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
import TabBar, { TabItem } from "./components/TabBar.vue";
import TextPage from "./components/TextPage.vue";
import ThermalSurvey from "./components/ThermalSurvey.vue";

export default defineComponent({
	components: {
		TabBar,
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
		setPhase(phase: TabItem) {
			this.phase = phase;
		},
	},
});
</script>
