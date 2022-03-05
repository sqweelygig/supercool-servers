<template>
	<page-header v-bind:text="header" />
	<div>{{ content }}</div>
	<div class="spacer"></div>
	<tool-bar v-on:next="$emit('next')" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PageHeader from "../components/PageHeader.vue";
import ToolBar from "../components/ToolBar.vue";

export default defineComponent({
	components: { PageHeader, ToolBar },
	emits: {
		next(): boolean {
			return true;
		},
	},
	props: {
		content: {
			required: true,
			type: String,
		},
		header: {
			required: true,
			type: String,
		},
	},
});
</script>
