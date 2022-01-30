<template>
	<ThermalProperties />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ThermalProperties from "./components/ThermalProperties.vue";

export default defineComponent({
	name: "SuperCool Servers",
	components: {
		ThermalProperties,
	},
});
</script>

<style lang="scss">
:root {
	--black: hsl(240, 0%, 0%);
	--dark: hsl(240, 25%, 25%);
	--mid: hsl(240, 50%, 50%);
	--light: hsl(240, 75%, 75%);
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
	margin: 1rem;
	padding: 1rem;
}
</style>
