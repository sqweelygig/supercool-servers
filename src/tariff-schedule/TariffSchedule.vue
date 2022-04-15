<template>
	<error-message v-if="error !== undefined" v-on:clear="clearError" />
	<tool-bar
		v-else
		v-bind:download="stringified"
		v-on:clear="clearData"
		v-on:next="onNext"
		v-on:previous="onPrevious"
		v-on:upload="upload"
	/>
	<page-header text="Tariff Schedule" />
	<div class="form-group">
		<label for="units" class="section-header">Units:</label>
		<input id="units" v-model="data.units" />
	</div>
	<div class="form-group">
		<label for="day-cost" class="section-header">
			Daytime consumption per hour:
		</label>
		<input id="day-cost" type="number" v-model.number="data.dayCost" />
	</div>
	<div class="form-group">
		<label for="day-start" class="section-header">Day rate begins:</label>
		<input id="day-start" type="time" v-model="data.dayStart" />
	</div>
	<div class="form-group">
		<label for="night-cost" class="section-header">
			Overnight consumption per hour:
		</label>
		<input id="night-cost" type="number" v-model.number="data.nightCost" />
	</div>
	<div class="form-group">
		<label for="night-start" class="section-header">Night rate begins:</label>
		<input id="night-start" type="time" v-model="data.nightStart" />
	</div>
	<div class="spacer"></div>
	<tool-bar v-on:next="onNext" />
</template>

<style scoped lang="scss">
.form-group {
	> * {
		display: block;
	}
	> label {
		text-transform: capitalize;
	}
	> input {
		background-color: var(--light);
		border-radius: var(--medium-small);
		font-size: var(--medium-large);
		padding: var(--small);
	}
	> input[type="time"] {
		padding: var(--extra-small);
		padding-left: 2.3em;
	}
}
</style>

<script lang="ts">
import {
	TariffInterval,
	isTariffInterval,
	padTariffScheduleState,
	isTariffScheduleState,
} from "./TariffSchedule.types";
import { toTariffIntervals } from "./TariffSchedule.pipes";
import { defineComponent, PropType } from "vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import PageHeader from "@/components/PageHeader.vue";
import ToolBar from "@/components/ToolBar.vue";
import useDataBoundary from "@/composables/useDataBoundary";

export default defineComponent({
	components: { ErrorMessage, PageHeader, ToolBar },
	emits: {
		update: (payload: Array<TariffInterval>) => {
			return payload.every(isTariffInterval);
		},
	},
	props: {
		onNext: Function as PropType<() => void>,
		onPrevious: Function as PropType<() => void>,
	},
	setup: function (props, context) {
		return useDataBoundary(
			"tariffSchedule",
			padTariffScheduleState,
			isTariffScheduleState,
			toTariffIntervals,
			(tariffIntervals) => context.emit("update", tariffIntervals)
		);
	},
});
</script>
