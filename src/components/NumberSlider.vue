<template>
	<div class="number-slider">
		<label v-if="question" v-bind:for="id">
			{{ question }}
		</label>
		<label v-bind:for="id">
			{{ label }}:
			<output v-bind:for="id">{{ modelValue }}{{ units }}</output>
		</label>
		<input
			step="1"
			type="range"
			v-bind:id="id"
			v-bind:max="maximum"
			v-bind:min="minimum"
			v-bind:value="modelValue"
			v-on:input="$emit('update:modelValue', $event.target.value)"
		/>
	</div>
</template>

<style scoped lang="scss">
/* TODO Style these range inputs onto colour scheme */
.number-slider {
	> * {
		display: block;
		margin: 0.5rem 0;
		width: 100%;
	}
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		id: {
			type: String,
		},
		label: {
			type: String,
		},
		maximum: {
			type: Number,
		},
		minimum: {
			type: Number,
		},
		modelValue: {
			type: Number,
		},
		question: {
			type: String || null,
		},
		units: {
			type: String,
		},
	},
});
</script>
