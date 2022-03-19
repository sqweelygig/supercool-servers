<template>
	<page-header v-bind:text="header" />
	<div v-for="paragraph in content" v-bind:key="paragraph">{{ paragraph }}</div>
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
		content: Array as PropType<string[]>,
		header: String,
		onNext: Function as PropType<() => void>,
	},
});
</script>
