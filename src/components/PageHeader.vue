<template>
	<h1 class="page-header">
		{{ text }}
	</h1>
</template>

<style scoped lang="scss">
.page-header {
	color: var(--dark);
	font-size: 1.5em;
	text-align: center;
	text-transform: capitalize;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		text: {
			type: String,
		},
	},
});
</script>
