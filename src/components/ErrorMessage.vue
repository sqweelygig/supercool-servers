<template>
	<div class="error-message" v-on:click.prevent="this.onClear">
		<span>Something went wrong.</span>
		<font-awesome-icon icon="times" />
	</div>
</template>

<style scoped lang="scss">
.error-message {
	background: var(--contrast-light);
	border-radius: var(--medium);
	cursor: pointer;
	display: grid;
	gap: var(--medium);
	grid-auto-flow: column;
	grid-template-columns: 1fr;
	grid-auto-columns: auto;
	padding: var(--medium-small);
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
	props: { onClear: Function },
});
</script>
