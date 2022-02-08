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
			} else if (
				recent.endTemperature === this.endTemperature &&
				recent.startTemperature === this.startTemperature
			) {
				return [this.onRise, this.onFall];
			} else if (recent.initialObservation === undefined) {
				if (this.startTemperature > this.endTemperature) {
					return [this.onFall];
				} else {
					return [this.onRise];
				}
			} else if (recent.initialObservation === true) {
				return [this.onRise];
			} else if (recent.initialObservation === false) {
				return [this.onFall];
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
					startTemperature: this.startTemperature,
					startTime: rightNow,
				};
				this.$emit(
					"update:modelValue",
					this.modelValue.slice(0, -1).concat([newTail])
				);
			} else if (recent.endTime === undefined) {
				const newTail = {
					...recent,
					dutyCycle: this.startTemperature > this.endTemperature ? 1 : 0,
					endTemperature: this.endTemperature,
					endTime: rightNow,
				};
				this.$emit(
					"update:modelValue",
					this.modelValue.slice(0, -1).concat([newTail])
				);
			} else {
				const newTail = {
					startTemperature: this.startTemperature,
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
		endTemperature: {
			required: true,
			type: Number,
		},
		explanation: String,
		modelValue: {
			default: () => {
				return [];
			},
			type: Array as PropType<Array<Partial<ThermalObservation>>>,
		},
		question: String,
		startTemperature: {
			required: true,
			type: Number,
		},
	},
});
</script>
