<template>
	<div class="tool-bar">
		<button
			aria-label="Back"
			v-if="this.onBack"
			type="button"
			v-on:click.prevent="this.onBack"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onBack)"
		>
			<font-awesome-icon icon="chevron-left" />
		</button>
		<a
			aria-label="Download"
			v-if="this.download"
			v-bind:disabled="this.disabled && this.disabled.includes(this.download)"
			download="thermal-data.json"
			v-bind:href="this.downloadData"
		>
			<font-awesome-icon icon="download" />
		</a>
		<input
			v-bind:disabled="this.disabled && this.disabled.includes(this.onUpload)"
			v-if="this.onUpload"
			id="file-upload"
			type="file"
			v-on:change="uploadData"
		/>
		<label
			aria-label="Upload"
			v-if="this.onUpload"
			for="file-upload"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onUpload)"
		>
			<font-awesome-icon icon="upload" />
		</label>
		<button
			aria-label="Rising Edge"
			type="button"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onRise)"
			v-if="this.onRise"
			v-on:click.prevent="this.onRise"
		>
			<font-awesome-icon icon="level-up-alt" />
		</button>
		<button
			aria-label="Falling Edge"
			type="button"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onFall)"
			v-if="this.onFall !== undefined"
			v-on:click.prevent="this.onFall"
		>
			<font-awesome-icon icon="level-down-alt" />
		</button>
		<button
			aria-label="Undo"
			type="button"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onUndo)"
			v-if="this.onUndo !== undefined"
			v-on:click.prevent="this.onUndo"
		>
			<font-awesome-icon icon="undo-alt" />
		</button>
		<button
			aria-label="Trash"
			v-if="this.onClear"
			type="button"
			v-on:click.prevent="this.onClear"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onClear)"
		>
			<font-awesome-icon icon="trash" />
		</button>
		<button
			aria-label="Next"
			v-if="this.onNext"
			type="button"
			v-on:click.prevent="this.onNext"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onNext)"
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
import { defineComponent } from "vue";
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
	computed: {
		downloadData(): string {
			const preamble = "data:application/json;charset=utf-8,";
			return preamble + this.download;
		},
	},
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
		onBack: Function,
		onClear: Function,
		onFall: Function,
		onNext: Function,
		onRise: Function,
		onUndo: Function,
		onUpload: Function,
	},
});
</script>