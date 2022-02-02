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
