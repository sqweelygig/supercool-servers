<template>
	<!-- TODO Add icons to tab-bar -->
	<tab-bar v-bind:selections="Phases" v-model="phase" />
	<div class="content-pane">
		<!-- TODO Make about into an SFC -->
		<template v-if="phase === Phases.Introduction">
			<page-header text="SuperCool Servers" />
			<div>
				This is a web application for modelling the savings possible by
				proactively cooling a server room during off-peak tariffs. All data is
				stored and processed locally, on your computer, without use of any
				external data processors.
			</div>
			<div class="spacer"></div>
			<tool-bar v-on:next="setPhase(Phases.Survey)" />
		</template>
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
div.content-pane {
	background: var(--white);
	color: var(--black);
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: space-between;
}
div.content-pane:deep() {
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
		border-radius: 0 0 var(--medium-small) var(--medium-small);
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
import PageHeader from "./components/PageHeader.vue";
import TabBar from "./components/TabBar.vue";
import ThermalSurvey from "./components/ThermalSurvey.vue";
import ToolBar from "./components/ToolBar.vue";

export enum Phases {
	Introduction = "Introduction",
	Survey = "Thermal Survey",
	Tariff = "Tariff Schedule",
}

export default defineComponent({
	components: {
		PageHeader,
		TabBar,
		ThermalSurvey,
		ToolBar,
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
