<template>
	<div class="page-header">
		{{ text }}
	</div>
</template>

<style scoped lang="scss">
.page-header {
	color: var(--dark);
	font-size: var(--large);
	font-weight: bold;
	text-align: center;
	text-transform: capitalize;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		text: String,
	},
});
</script>
