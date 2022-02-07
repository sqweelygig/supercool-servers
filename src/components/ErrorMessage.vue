<template>
	<div class="error-message" v-on:click.prevent="this.onClear">
		<span>{{ error.message }}</span>
		<font-awesome-icon icon="times" />
	</div>
</template>

<style scoped lang="scss">
.error-message {
	background: var(--contrast-light);
	border-radius: 0.6rem;
	cursor: pointer;
	display: grid;
	gap: 0.6rem;
	grid-auto-flow: column;
	grid-template-columns: 1fr;
	grid-auto-columns: auto;
	padding: 0.6rem;
	text-align: center;
	> * {
		margin: 0;
	}
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library as IconLibrary } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

IconLibrary.add(faTimes);

export default defineComponent({
	components: { FontAwesomeIcon },
	props: {
		error: {
			type: Error,
		},
		onClear: {
			type: Function,
		},
	},
});
</script>
