<template>
	<div class="duty-cycle">
		<div class="section-header">{{ question }}</div>
		<div>{{ explanation }}</div>
		<duty-table v-bind:observations="modelValue" />
		<tool-bar
			v-bind:disabled="disabledButtons"
			v-on:fall="onFall"
			v-on:rise="onRise"
			v-on:undo="undo"
		/>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import DutyTable from "./DutyTable.vue";
import { ThermalObservation } from "./ThermalSurvey.types";
import ToolBar from "@/components/ToolBar.vue";

export default defineComponent({
	components: { DutyTable, ToolBar },
	computed: {
		disabledButtons() {
			const recent = this.modelValue[this.modelValue.length - 1] || {};
			if (this.disabled) {
				return [this.onRise, this.onFall];
			} else if (recent.endTime !== undefined) {
				return [];
			} else if (recent.initiallyObservedRisingEdge === true) {
				if (recent.transitionTime === undefined) {
					return [this.onRise];
				} else {
					return [this.onFall];
				}
			} else if (recent.initiallyObservedRisingEdge === false) {
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
		observe(isRisingEdge: boolean): void {
			const rightNow = new Date();
			const recent = this.modelValue[this.modelValue.length - 1] || {};
			if (
				recent.startTime === undefined &&
				recent.transitionTime === undefined &&
				recent.endTime === undefined
			) {
				const newTail = {
					initiallyObservedRisingEdge: isRisingEdge,
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
				recent.startTime !== undefined &&
				recent.transitionTime !== undefined &&
				recent.endTime === undefined
			) {
				const transitionTime = recent.transitionTime;
				const startTime = recent.startTime;
				const initialTime = transitionTime.getTime() - startTime.getTime();
				const totalTime = rightNow.getTime() - startTime.getTime();
				const initialProportion = initialTime / totalTime;
				const dutyCycle = recent.initiallyObservedRisingEdge
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
					initiallyObservedRisingEdge: isRisingEdge,
				};
				this.$emit(
					"update:modelValue",
					this.modelValue.slice(0, -1).concat([newTail, nextTail])
				);
			} else {
				const newTail = {
					startTemperature: this.temperature,
					startTime: rightNow,
					initiallyObservedRisingEdge: isRisingEdge,
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
		undo(): void {
			this.$emit("update:modelValue", this.modelValue.slice(0, -1));
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
