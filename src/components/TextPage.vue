<template>
	<page-header v-bind:text="header" />
	<div>{{ content }}</div>
	<div class="spacer"></div>
	<tool-bar v-on:next="onNext" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PageHeader from "./PageHeader.vue";
import ToolBar from "./ToolBar.vue";

export default defineComponent({
	components: { PageHeader, ToolBar },
	props: {
		content: {
			required: true,
			type: String,
		},
		onNext: Function,
		header: {
			required: true,
			type: String,
		},
	},
});
</script>
