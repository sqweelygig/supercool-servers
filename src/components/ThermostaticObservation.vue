<template>
	<div class="duty-cycle">
		<div class="section-header">{{ question }}</div>
		<div>{{ explanation }}</div>
		<duty-table v-bind:observations="this.modelValue" />
		<tool-bar
			v-bind:disabled="this.disabledButtons"
			v-bind:on-undo="this.clear"
			v-bind:on-rise="this.onRise"
			v-bind:on-fall="this.onFall"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import DutyTable, { ThermalObservation } from "./DutyTable.vue";
import ToolBar from "./ToolBar.vue";

export default defineComponent({
	components: { DutyTable, ToolBar },
	computed: {
		disabledButtons() {
			const recent = this.modelValue[this.modelValue.length - 1] || {};
			if (this.disabled) {
				return [this.onRise, this.onFall];
			} else if (recent.endTime !== undefined) {
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
			if (
				recent.startTime === undefined &&
				recent.transitionTime === undefined &&
				recent.endTime === undefined
			) {
				const newTail = {
					initialObservation: isRisingEdge,
					startTemperature: this.temperature,
					startTime: rightNow,
				};
				this.$emit(
					"update:modelValue",
					this.modelValue.slice(0, -1).concat([newTail])
				);
			} else if (
				recent.startTime !== undefined &&
				recent.transitionTime === undefined &&
				recent.endTime === undefined
			) {
				const newTail = { ...recent, transitionTime: rightNow };
				this.$emit(
					"update:modelValue",
					this.modelValue.slice(0, -1).concat([newTail])
				);
			} else if (
				// TODO Replace this whole time listing with a list of times
				recent.startTime !== undefined &&
				recent.transitionTime !== undefined &&
				recent.endTime === undefined
			) {
				const initialTime = recent.transitionTime - recent.startTime;
				const totalTime = rightNow - recent.startTime;
				const initialProportion = initialTime / totalTime;
				const dutyCycle = recent.initialObservation
					? initialProportion
					: 1 - initialProportion;
				const newTail = {
					...recent,
					dutyCycle,
					endTemperature: this.temperature,
					endTime: rightNow,
				};
				const nextTail = {
					startTemperature: this.temperature,
					startTime: rightNow,
					initialObservation: isRisingEdge,
				};
				this.$emit(
					"update:modelValue",
					this.modelValue.slice(0, -1).concat([newTail, nextTail])
				);
			} else {
				const newTail = {
					startTemperature: this.temperature,
					startTime: rightNow,
					initialObservation: isRisingEdge,
				};
				this.$emit("update:modelValue", this.modelValue.concat([newTail]));
			}
		},
		onFall() {
			this.observe(false);
		},
		onRise() {
			this.observe(true);
		},
	},
	props: {
		disabled: Boolean,
		explanation: String,
		modelValue: {
			default: () => {
				return [];
			},
			type: Array as PropType<Array<Partial<ThermalObservation>>>,
		},
		question: String,
		temperature: {
			required: true,
			type: Number,
		},
	},
});
</script>
