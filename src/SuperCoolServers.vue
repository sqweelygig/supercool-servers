<template>
	<div>
		<div class="tab-bar">
			<div
				v-bind:class="{ selected: this.phase === 'introduction' }"
				v-on:click.prevent="this.phase = 'introduction'"
			>
				Introduction
			</div>
			<div
				v-bind:class="{ selected: this.phase === 'survey' }"
				v-on:click.prevent="this.phase = 'survey'"
			>
				Thermal survey
			</div>
		</div>
		<template v-if="this.phase === 'introduction'">
			<page-header text="SuperCool Servers" />
			<div>
				This is a web application for modelling the savings possible by
				proactively cooling a server room during off-peak tariffs. All data is
				stored and processed locally, on your computer, without use of any
				external data processors.
			</div>
			<div class="spacer"></div>
			<tool-bar v-on:next="this.doNext" />
		</template>
		<thermal-survey
			v-else-if="this.phase === 'survey'"
			v-on:previous="this.doPrevious"
			v-on:next="this.doNext"
		/>
	</div>
</template>

<style scoped lang="scss">
div:deep() {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	min-height: calc(100vh - 2 * var(--medium-small));
	> div {
		background: var(--white);
		color: var(--black);
		min-height: auto;
		padding-bottom: var(--small);
		padding-left: var(--medium);
		padding-right: var(--medium);
		padding-top: var(--small);
	}
	> div:last-child {
		border-radius: 0 0 var(--medium-small) var(--medium-small);
		padding-bottom: var(--medium);
	}
	> div.spacer {
		flex-grow: 1;
		padding: 0;
	}
	> div.tab-bar {
		background: transparent;
		display: flex;
		gap: var(--medium-small);
		flex-direction: row;
		padding: 0;
		> div {
			background: var(--light);
			border-radius: var(--medium-small) var(--medium-small) 0 0;
			cursor: pointer;
			flex-grow: 1;
			font-size: var(--medium-large);
			padding: var(--small);
		}
		> div.selected {
			background: var(--white);
		}
	}
	> div.tab-bar + div {
		padding-top: var(--medium);
	}
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import PageHeader from "./components/PageHeader.vue";
import ThermalSurvey from "./components/ThermalSurvey.vue";
import ToolBar from "./components/ToolBar.vue";

enum Phases {
	Introduction = "introduction",
	Survey = "survey",
}

export default defineComponent({
	components: {
		PageHeader,
		ThermalSurvey,
		ToolBar,
	},
	data() {
		return {
			phase: Phases.Introduction,
		};
	},
	methods: {
		doNext() {
			if (this.phase === Phases.Introduction) {
				this.phase = Phases.Survey;
			}
		},
		doPrevious() {
			if (this.phase === Phases.Survey) {
				this.phase = Phases.Introduction;
			}
		},
	},
});
</script>
