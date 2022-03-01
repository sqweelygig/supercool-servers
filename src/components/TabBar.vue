<template>
	<div class="tab-bar">
		<div
			v-bind:class="{ selected: modelValue === selection }"
			v-bind:key="selection"
			v-for="selection in selections"
			v-on:click.prevent="$emit('update:modelValue', selection)"
		>
			{{ selection }}
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
	}
	> div.selected {
		background: var(--white);
		flex-shrink: 0;
	}
}
div.tab-bar + div {
	padding-top: var(--medium);
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		modelValue: {
			required: true,
		},
		selections: {
			required: true,
		},
	},
});
</script>
