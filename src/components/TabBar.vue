<template>
	<div class="tab-bar">
		<div
			v-for="option in options"
			v-bind:class="{ selected: modelValue === option.value }"
			v-bind:key="option.text"
			v-on:click.prevent="$emit('update:modelValue', option.value)"
		>
			<font-awesome-icon v-bind:icon="option.icon" />
			<span>{{ option.text }}</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
div.tab-bar {
	background: transparent;
	display: flex;
	gap: var(--medium-small);
	flex-direction: row;
	padding: 0;
	> div {
		background: var(--light);
		border-radius: var(--medium-small) var(--medium-small) 0 0;
		cursor: pointer;
		display: block;
		flex-grow: 1;
		font-size: var(--medium-large);
		overflow: hidden;
		padding: var(--small);
		text-overflow: ellipsis;
		white-space: nowrap;
		> * {
			margin-left: 0.3em;
		}
		> *:first-child {
			margin-left: 0;
		}
		> *:last-child {
			display: none;
		}
	}
	> div.selected {
		background: var(--white);
		flex-shrink: 0;
		> *:last-child {
			display: inline-block;
		}
	}
}
div.tab-bar + div {
	padding-top: var(--medium);
}
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { library as IconLibrary } from "@fortawesome/fontawesome-svg-core";
import {
	faInfoCircle,
	faMoneyBill,
	faThermometerHalf,
	faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

IconLibrary.add(faInfoCircle, faMoneyBill, faThermometerHalf, faChartLine);

export type TabItem = {
	icon: string;
	text: string;
	value: string;
};

export function usePhases<Phase extends { value: string }>(
	phases: Phase[],
	store: { data: { phase: string } },
	beforeFirst?: () => void,
	afterFinal?: () => void,
	eachPhase?: () => void
): { phaseShift: (shift: number) => void; phases: Phase[] } {
	const phaseShift = (shift = 1) => {
		for (let i = 0; i < Math.abs(shift); i++) {
			eachPhase?.();
		}
		const currentIndex = phases.findIndex(
			(eachPhase) => eachPhase.value === store.data.phase
		);
		const proposedIndex = currentIndex + shift;
		if (proposedIndex < 0) {
			beforeFirst?.();
		} else if (phases.length <= proposedIndex) {
			afterFinal?.();
		}
		const lowerBounded = Math.max(proposedIndex, 0);
		const bounded = Math.min(lowerBounded, phases.length - 1);
		store.data.phase = phases[bounded].value;
	};
	return { phaseShift, phases };
}

export default defineComponent({
	components: {
		FontAwesomeIcon,
	},
	props: {
		modelValue: {
			required: true,
		},
		options: {
			required: true,
			type: Array as PropType<Array<TabItem>>,
		},
	},
});
</script>
