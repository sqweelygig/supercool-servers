<template>
	<table>
		<tr>
			<th colspan="2">Start</th>
			<th colspan="1">Duty</th>
			<th colspan="2">End</th>
		</tr>
		<tr v-if="observations.length === 0">
			<td>--:--:--</td>
			<td>--°C</td>
			<td>--%</td>
			<td>--:--:--</td>
			<td>--°C</td>
		</tr>
		<tr v-bind:key="index" v-for="(observation, index) in observations">
			<td v-if="observation.startTime !== undefined">
				{{ observation.startTime.toLocaleTimeString() }}
			</td>
			<td v-else>--:--:--</td>
			<td v-if="observation.startTemperature">
				{{ observation.startTemperature }}°C
			</td>
			<td v-else>--°C</td>
			<td v-if="observation.dutyCycle !== undefined">
				{{ Math.round(observation.dutyCycle * 100) }}%
			</td>
			<td v-else>--%</td>
			<td v-if="observation.endTime !== undefined">
				{{ observation.endTime.toLocaleTimeString() }}
			</td>
			<td v-else-if="observation.transitionTime !== undefined">
				{{ observation.transitionTime.toLocaleTimeString() }}
			</td>
			<td v-else>--:--:--</td>
			<td v-if="observation.endTemperature">
				{{ observation.endTemperature }}°C
			</td>
			<td v-else>--°C</td>
		</tr>
	</table>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ThermalInterval, isThermalInterval } from "../types";

export interface ThermalObservation extends ThermalInterval {
	initialObservation: boolean;
	transitionTime?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export function isThermalObservation(data: any): data is ThermalObservation {
	return (
		typeof data.initialObservation === "boolean" &&
		(typeof data.transitionTime === "undefined" ||
			data.transitionTime instanceof Date) &&
		isThermalInterval(data)
	);
}

export default defineComponent({
	props: {
		observations: {
			default: () => {
				return [];
			},
			type: Array as PropType<Array<Partial<ThermalObservation>>>,
		},
	},
});
</script>
