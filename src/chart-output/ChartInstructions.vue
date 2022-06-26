<template>
	<error-message
		message="Cannot optimise a room without both a thermal survey and a tariff schedule."
	/>
	<vertical-spacer />
	<tool-bar v-on:previous="onPrevious" />
</template>

<script lang="ts">
import ToolBar from "@/components/ToolBar.vue";
import { defineComponent, PropType } from "vue";
import VerticalSpacer from "@/components/VerticalSpacer.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default defineComponent({
	components: { ToolBar, VerticalSpacer, ErrorMessage },
	props: {
		onPrevious: Function as PropType<() => void>,
	},
});
</script>
