<template>
	<div class="duty-cycle">
		<div class="section-header">{{ question }}</div>
		<div>{{ explanation }}</div>
		<table>
			<tr v-bind:key="index" v-for="(observation, index) in modelValue">
				<td v-if="observation.startTime !== undefined">
					{{ new Date(observation.startTime).toLocaleTimeString() }}
				</td>
				<td v-else>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td>
				<td v-if="observation.transitionTime !== undefined">
					{{ new Date(observation.transitionTime).toLocaleTimeString() }}
				</td>
				<td v-else>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td>
				<td v-if="observation.endTime !== undefined">
					{{ new Date(observation.endTime).toLocaleTimeString() }}
				</td>
				<td v-else>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</td>
				<td v-if="observation.dutyCycle !== undefined">
					{{ Math.round(observation.dutyCycle * 100) }}%
				</td>
				<td v-else>&nbsp; &nbsp; &nbsp;</td>
			</tr>
		</table>
		<tool-bar
			v-bind:disabled="this.disabled"
			v-bind:on-clear="this.clear"
			v-bind:on-rise="this.onRise"
			v-bind:on-fall="this.onFall"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ThermalInterval } from "../types";
import ToolBar from "./ToolBar.vue";

export interface ThermostaticObservation extends ThermalInterval {
	initialObservation: boolean;
	transitionTime: number;
}

export default defineComponent({
	components: { ToolBar },
	computed: {
		disabled() {
			const recent = this.modelValue[this.modelValue.length - 1] || {};
			if (recent.endTime !== undefined) {
				return [];
			} else if (recent.initialObservation === true) {
				if (recent.transitionTime === undefined) {
					return [this.onRise];
				} else {
					return [this.onFall];
				}
			} else if (recent.initialObservation === false) {
				if (recent.transitionTime === undefined) {
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
		clear(): void {
			this.$emit("update:modelValue", this.modelValue.slice(0, -1));
		},
		observe(isRisingEdge: boolean): void {
			const rightNow = Date.now();
			const recent = this.modelValue[this.modelValue.length - 1] || {};
			if (recent.startTime === undefined) {
				const newTail = {
					initialObservation: isRisingEdge,
					startTemperature: this.thermostat,
					startTime: rightNow,
				};
				this.$emit(
					"update:modelValue",
					this.modelValue.slice(0, -1).concat([newTail])
				);
			} else if (recent.transitionTime === undefined) {
				const newTail = { ...recent, transitionTime: rightNow };
				this.$emit(
					"update:modelValue",
					this.modelValue.slice(0, -1).concat([newTail])
				);
			} else if (recent.endTime === undefined) {
				const initialTime = recent.transitionTime - recent.startTime;
				const totalTime = rightNow - recent.startTime;
				const initialProportion = initialTime / totalTime;
				const dutyCycle = recent.initialObservation
					? initialProportion
					: 1 - initialProportion;
				const newTail = {
					...recent,
					dutyCycle,
					endTemperature: this.thermostat,
					endTime: rightNow,
				};
				const nextTail = {
					startTemperature: this.thermostat,
					startTime: rightNow,
					initialObservation: isRisingEdge,
				};
				this.$emit(
					"update:modelValue",
					this.modelValue.slice(0, -1).concat([newTail, nextTail])
				);
			} else {
				const newTail = {
					startTemperature: this.thermostat,
					startTime: rightNow,
					initialObservation: isRisingEdge,
				};
				this.$emit("update:modelValue", this.modelValue.concat([newTail]));
			}
		},
		onFall() {
			if (this.observe) this.observe(false);
		},
		onRise() {
			if (this.observe) this.observe(true);
		},
	},
	props: {
		explanation: String,
		modelValue: {
			default: () => {
				return [];
			},
			type: Array as PropType<Array<Partial<ThermostaticObservation>>>,
		},
		question: String,
		thermostat: {
			required: true,
			type: Number,
		},
	},
});
</script>
