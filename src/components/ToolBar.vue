<template>
	<div class="tool-bar">
		<button
			v-if="onPrevious"
			type="button"
			v-bind:disabled="disabled?.includes(onPrevious)"
			v-on:click.prevent="onPrevious"
		>
			<font-awesome-icon icon="chevron-left" />
		</button>
		<a
			v-if="downloadName"
			v-bind:download="downloadName"
			v-bind:disabled="
				disabled?.includes(download) ||
				disabled?.includes(downloadName) ||
				download === undefined
			"
			v-bind:href="encodeURI(download || '')"
		>
			<font-awesome-icon icon="download" />
		</a>
		<input
			v-if="onUpload"
			id="file-upload"
			type="file"
			v-bind:disabled="disabled?.includes(onUpload)"
			v-on:change="uploadData"
		/>
		<label
			v-if="onUpload"
			for="file-upload"
			v-bind:disabled="disabled?.includes(onUpload)"
		>
			<font-awesome-icon icon="upload" />
		</label>
		<button
			v-if="onRise"
			type="button"
			v-bind:disabled="disabled?.includes(onRise)"
			v-on:click.prevent="onRise"
		>
			<font-awesome-icon icon="level-up-alt" />
		</button>
		<button
			v-if="onFall"
			type="button"
			v-bind:disabled="disabled?.includes(onFall)"
			v-on:click.prevent="onFall"
		>
			<font-awesome-icon icon="level-down-alt" />
		</button>
		<button
			v-if="onUndo"
			type="button"
			v-bind:disabled="disabled?.includes(onUndo)"
			v-on:click.prevent="onUndo"
		>
			<font-awesome-icon icon="undo-alt" />
		</button>
		<button
			v-if="onClear"
			type="button"
			v-bind:disabled="disabled?.includes(onClear)"
			v-on:click.prevent="onClear"
		>
			<font-awesome-icon icon="trash" />
		</button>
		<button
			v-if="onNext"
			type="button"
			v-bind:disabled="disabled?.includes(onNext)"
			v-on:click.prevent="onNext"
		>
			<font-awesome-icon icon="chevron-right" />
		</button>
	</div>
</template>

<style scoped lang="scss">
.tool-bar {
	display: grid;
	gap: var(--medium-small);
	grid-auto-columns: 1fr;
	grid-auto-flow: column;
	justify-content: center;
	> * {
		background: var(--light);
		border: 0;
		border-radius: var(--medium-small);
		box-sizing: border-box;
		color: var(--black);
		cursor: pointer;
		font-size: 100%;
		margin: 0;
		padding: var(--medium-small);
		text-align: center;
		text-decoration: none;
		> * {
			margin: 0;
		}
	}
	> input[type="file"] {
		height: 1px;
		opacity: 0;
		overflow: hidden;
		position: absolute;
		width: 1px;
		z-index: -1;
	}
	> input[type="file"]:focus + label {
		outline: 1px dotted #000;
		outline: -webkit-focus-ring-color auto 5px;
	}
	> *:disabled {
		background-color: var(--muted-light);
	}
}
</style>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { library as IconLibrary } from "@fortawesome/fontawesome-svg-core";
import {
	faChevronLeft,
	faChevronRight,
	faDownload,
	faLevelDownAlt,
	faLevelUpAlt,
	faTrash,
	faUndoAlt,
	faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

IconLibrary.add(
	faChevronLeft,
	faChevronRight,
	faDownload,
	faLevelDownAlt,
	faLevelUpAlt,
	faTrash,
	faUndoAlt,
	faUpload
);

export default defineComponent({
	components: { FontAwesomeIcon },
	methods: {
		uploadData(uploadEvent: Event): void {
			if (this.onUpload && uploadEvent.target) {
				const uploadTarget = uploadEvent.target as HTMLInputElement;
				if (uploadTarget.files) {
					const file = uploadTarget.files[0];
					if (file) {
						const reader = new FileReader();
						reader.addEventListener("load", (loadEvent) => {
							if (
								this.onUpload &&
								typeof loadEvent?.target?.result === "string"
							) {
								this.onUpload(loadEvent.target.result);
							}
							uploadTarget.value = "";
						});
						reader.readAsText(file);
					}
				}
			}
		},
	},
	props: {
		disabled: Array,
		download: String,
		downloadName: String,
		onClear: Function as PropType<() => void>,
		onFall: Function as PropType<() => void>,
		onNext: Function as PropType<() => void>,
		onPrevious: Function as PropType<() => void>,
		onRise: Function as PropType<() => void>,
		onUndo: Function as PropType<() => void>,
		onUpload: Function,
	},
});
</script>
