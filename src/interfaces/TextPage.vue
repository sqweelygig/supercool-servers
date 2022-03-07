<template>
	<page-header v-bind:text="header" />
	<div>{{ content }}</div>
	<div class="spacer"></div>
	<tool-bar v-on:next="onNext" />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import PageHeader from "@/components/PageHeader.vue";
import ToolBar from "@/components/ToolBar.vue";

export default defineComponent({
	components: { PageHeader, ToolBar },
	props: {
		content: String,
		header: String,
		onNext: Function as PropType<() => void>,
	},
});
</script>
