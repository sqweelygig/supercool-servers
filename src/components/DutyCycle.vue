<template>
	<div class="duty-cycle">
		<div class="section-header">{{ question }}</div>
		<div>{{ explanation }}</div>
		<div v-bind:key="index" v-for="(observation, index) in observations">
			{{ new Date(observation.startTime).toLocaleTimeString() }}
			-
			{{ new Date(observation.endTime).toLocaleTimeString() }}
			:
			{{ Math.round(observation.dutyCycle * 100) }}%
		</div>
		<tool-bar
			v-bind:disabled="this.disabled"
			v-bind:on-clear="this.clear"
			v-bind:on-rise="this.onRise"
			v-bind:on-fall="this.onFall"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Interval } from "../types";
import ToolBar from "./ToolBar.vue";

export interface CurrentObservation extends Partial<Interval> {
	initialObservation?: boolean;
	transitionTime?: number;
}

export default defineComponent({
	components: { ToolBar },
	computed: {
		disabled() {
			if (this.observation.initialObservation === true) {
				if (this.observation.transitionTime === undefined) {
					return [this.onRise];
				} else {
					return [this.onFall];
				}
			} else if (this.observation.initialObservation === false) {
				if (this.observation.transitionTime === undefined) {
					return [this.onFall];
				} else {
					return [this.onRise];
				}
			} else {
				return [];
			}
		},
	},
	methods: {
		onFall() {
			if (this.observe) this.observe(false);
		},
		onRise() {
			if (this.observe) this.observe(true);
		},
	},
	props: {
		clear: Function,
		explanation: String,
		observe: Function,
		observation: {
			required: true,
			type: Object,
		},
		observations: Array,
		question: String,
	},
});
</script>
