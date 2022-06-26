<template>
	<div class="error-message" v-on:click.prevent="onClear">
		<div>
			<span>{{ message || "Something went wrong." }}</span>
			<font-awesome-icon icon="times" v-if="onClear" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.error-message {
	cursor: pointer;
	text-align: center;
	> * {
		align-items: center;
		background: var(--contrast-light);
		border-radius: var(--medium-small);
		display: grid;
		gap: var(--medium);
		grid-auto-flow: column;
		grid-template-columns: 1fr;
		grid-auto-columns: auto;
		margin: 0;
		padding: var(--medium-small);
	}
}
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library as IconLibrary } from "@fortawesome/fontawesome-svg-core";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

IconLibrary.add(faTimes);

export default defineComponent({
	components: { FontAwesomeIcon },
	props: {
		message: String,
		onClear: Function as PropType<() => void>,
	},
});
</script>
