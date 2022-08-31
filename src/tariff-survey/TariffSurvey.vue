<template>
	<error-message v-if="error !== undefined" v-on:clear="clearError" />
	<tool-bar
		v-else
		download-name="tariff-schedule.json"
		v-bind:download="'data:application/json;charset=utf-8,' + stringified"
		v-on:clear="clearData"
		v-on:next="onNext"
		v-on:previous="onPrevious"
		v-on:upload="upload"
	/>
	<page-header text="Tariff Schedule" />
	<div class="form-group">
		<label for="wattage" class="section-header">
			Power consumed in kilowatts:
		</label>
		<input id="wattage" type="number" v-model="data.wattage" />
	</div>
	<div class="form-group">
		<label for="units" class="section-header">Costing units:</label>
		<input id="units" v-model="data.units" />
	</div>
	<div class="form-group">
		<label for="day-cost" class="section-header">
			Daytime {{ data.units }} per kilowatt-hour:
		</label>
		<input id="day-cost" type="number" v-model.number="data.dayCost" />
	</div>
	<div class="form-group">
		<label for="day-start" class="section-header">Day rate begins:</label>
		<input id="day-start" type="time" v-model="data.dayStart" />
	</div>
	<div class="form-group">
		<label for="night-cost" class="section-header">
			Overnight {{ data.units }} per kilowatt-hour:
		</label>
		<input id="night-cost" type="number" v-model.number="data.nightCost" />
	</div>
	<div class="form-group">
		<label for="night-start" class="section-header">Night rate begins:</label>
		<input id="night-start" type="time" v-model="data.nightStart" />
	</div>
	<vertical-spacer />
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
	padTariffSurveyState,
	isTariffSurveyState,
	TariffSchedule,
	isTariffSchedule,
} from "./TariffSurvey.types";
import { toTariffSchedule } from "./ToTariffSchedule.pipe";
import { defineComponent, PropType } from "vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import PageHeader from "@/components/PageHeader.vue";
import ToolBar from "@/components/ToolBar.vue";
import useDataBoundary from "@/composables/useDataBoundary";
import VerticalSpacer from "@/components/VerticalSpacer.vue";

export default defineComponent({
	components: { ErrorMessage, PageHeader, ToolBar, VerticalSpacer },
	emits: {
		update: (payload: TariffSchedule) => {
			return isTariffSchedule(payload);
		},
	},
	props: {
		onNext: Function as PropType<() => void>,
		onPrevious: Function as PropType<() => void>,
	},
	setup: function (props, context) {
		return useDataBoundary(
			"tariffSurvey",
			padTariffSurveyState,
			isTariffSurveyState,
			toTariffSchedule,
			(tariffSchedule) => context.emit("update", tariffSchedule)
		);
	},
});
</script>
