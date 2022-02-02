<template>
	<p class="error-message">
		{{ error }}
	</p>
</template>

<style scoped lang="scss">
.error-message {
	color: var(--contrast-dark);
	text-align: center;
}
</style>

<script lang="ts">
// TODO In-app method for clearing error
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		error: {
			type: String,
		},
	},
});
</script>
