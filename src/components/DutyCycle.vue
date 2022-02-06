<template>
	<div class="duty-cycle">
		<div class="section-header">How hard is the A/C working?</div>
		<div>
			Please observe a few complete duty cycles including both on and off
			transitions.
		</div>
		<div v-bind:key="observation.startTime" v-for="observation in observations">
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
		disabled: function () {
			if (this.initialObservation === true) {
				if (this.transitionTime === undefined) {
					return [this.onRise];
				} else {
					return [this.onFall];
				}
			} else if (this.initialObservation === false) {
				if (this.transitionTime === undefined) {
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
		onFall: function () {
			if (this.observe) this.observe(false);
		},
		onRise: function () {
			if (this.observe) this.observe(true);
		},
	},
	props: {
		clear: Function,
		initialObservation: Boolean,
		observe: Function,
		observations: Array,
		transitionTime: Number,
	},
});
</script>
