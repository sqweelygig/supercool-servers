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
// TODO Work out how to replace #app with this components selector and possibly add display: block
#app > * {
	margin: 1rem;
}
</style>
