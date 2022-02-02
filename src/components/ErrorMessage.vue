<template>
	<div class="error-message" v-on:click.prevent="this.onClear">
		<span>{{ error }}</span>
		<font-awesome-icon icon="times" />
	</div>
</template>

<style scoped lang="scss">
.error-message {
	background: var(--contrast-light);
	border-radius: 0.5rem;
	cursor: pointer;
	display: flex;
	padding: 0.5rem;
	text-align: center;
	> span {
		flex-grow: 1;
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
			type: String,
		},
		onClear: {
			type: Function,
		},
	},
});
</script>
