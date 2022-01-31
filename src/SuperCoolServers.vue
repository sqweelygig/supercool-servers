<template>
	<thermal-survey />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ThermalSurvey from "./components/ThermalSurvey.vue";

export default defineComponent({
	name: "SuperCool Servers",
	components: {
		ThermalSurvey,
	},
});
</script>

<style lang="scss">
:root {
	--black: hsl(240, 0%, 0%);
	--dark: hsl(240, 25%, 25%);
	--mid: hsl(240, 50%, 50%);
	--light: hsl(240, 75%, 75%);
	--contrast-dark: hsl(0, 25%, 25%);
	--contrast-mid: hsl(0, 50%, 50%);
	--contrast-light: hsl(0, 75%, 75%);
	--muted-dark: hsl(0, 0%, 25%);
	--muted-mid: hsl(0, 0%, 50%);
	--muted-light: hsl(0, 0%, 75%);
	--white: hsl(240, 100%, 100%);
}

html,
body {
	background: var(--dark);
	border: 0;
	box-sizing: border-box;
	font-family: sans-serif;
	margin: 0;
	padding: 0;
	text-align: justify;
	text-align-last: center;
}

#app {
	background: var(--white);
	border-radius: 1rem;
	color: var(--black);
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin: 1rem;
	padding: 1rem;
	> * {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		width: 100%;
		> * {
			flex-grow: 1;
		}
	}
	input[type="range"] {
		width: 100%;
	}
	h1 {
		color: var(--dark);
		font-size: 1.5rem;
		margin: 0;
		padding: 0;
		text-align: center;
		text-transform: capitalize;
	}
}
</style>
