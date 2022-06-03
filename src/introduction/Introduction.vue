<template>
	<error-message v-if="error !== undefined" v-on:clear="clear" />
	<page-header v-else text="SuperCool Servers" />
	<div>
		This web application models the savings possible by proactively cooling a
		server room during off-peak tariffs.
	</div>
	<div>
		It applies some simplifying assumptions to its thermal model, which are
		reasonable for some server rooms. Firstly, The model assumes that air
		conditioning units perform most of the cooling. Furthermore, it assumes that
		the servers are the primary heat source and that this is constant. Finally,
		it assumes that heat propagation within the room is instant. Further
		development may occur to eliminate these simplifications. You are
		responsible for judging whether they are reasonable in your situation.
	</div>
	<div>
		All data is stored and processed locally, on your computer, without any
		external data processors.
	</div>
	<vertical-spacer />
	<tool-bar v-on:next="onNext" />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import PageHeader from "@/components/PageHeader.vue";
import VerticalSpacer from "@/components/VerticalSpacer.vue";
import useErrorCapture from "@/composables/useErrorCapture";
import ToolBar from "@/components/ToolBar.vue";

export default defineComponent({
	components: {
		ErrorMessage,
		PageHeader,
		ToolBar,
		VerticalSpacer,
	},
	props: {
		onNext: Function as PropType<() => void>,
		onPrevious: Function as PropType<() => void>,
	},
	setup: function () {
		return useErrorCapture();
	},
});
</script>
