<template>
	<div class="number-slider">
		<label v-if="question" v-bind:for="id" class="section-header">
			{{ question }}
		</label>
		<output v-bind:for="id">{{ modelValue }}{{ units }}</output>
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
.number-slider {
	> * {
		display: block;
	}
	> output {
		font-size: var(--medium-large);
	}
	// Many thanks to https://www.smashingmagazine.com/2021/12/create-custom-range-input-consistent-browsers/
	input[type="range"] {
		background: transparent;
		cursor: pointer;
		-webkit-appearance: none;
	}
	input[type="range"]::-webkit-slider-runnable-track {
		background: var(--light);
		border-radius: var(--medium);
		height: var(--large);
	}
	input[type="range"]::-moz-range-track {
		background: var(--light);
		border-radius: var(--medium);
		height: var(--large);
	}
	input[type="range"]::-webkit-slider-thumb {
		background-color: var(--black);
		border: none;
		border-radius: var(--medium);
		height: var(--large);
		width: var(--large);
		-webkit-appearance: none;
	}
	input[type="range"]::-moz-range-thumb {
		background-color: var(--black);
		border: none;
		border-radius: var(--medium);
		height: var(--large);
		width: var(--large);
		-webkit-appearance: none;
	}
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		id: String,
		maximum: Number,
		minimum: Number,
		modelValue: Number,
		question: String,
		units: String,
	},
});
</script>
