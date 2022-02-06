<template>
	<div class="tool-bar">
		<button
			v-if="this.onBack"
			type="button"
			v-on:click.prevent="this.onBack"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onBack)"
		>
			<font-awesome-icon icon="chevron-left" />
		</button>
		<a
			v-if="this.download"
			v-bind:disabled="this.disabled && this.disabled.includes(this.download)"
			download="thermal-data.json"
			v-bind:href="this.downloadData"
		>
			<font-awesome-icon icon="download" />
		</a>
		<label
			v-if="this.onUpload"
			for="file-upload"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onUpload)"
		>
			<font-awesome-icon icon="upload" />
		</label>
		<input
			v-bind:disabled="this.disabled && this.disabled.includes(this.onUpload)"
			v-if="this.onUpload"
			id="file-upload"
			type="file"
			v-on:change="uploadData"
		/>
		<button
			type="button"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onRise)"
			v-if="this.onRise"
			v-on:click.prevent="this.onRise"
		>
			On
		</button>
		<button
			type="button"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onFall)"
			v-if="this.onFall !== undefined"
			v-on:click.prevent="this.onFall"
		>
			Off
		</button>
		<button
			v-if="this.onClear"
			type="button"
			v-on:click.prevent="this.onClear"
			v-bind:disabled="this.disabled && this.disabled.includes(this.onClear)"
		>
			<font-awesome-icon icon="trash" />
		</button>
		<button
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
	gap: 1rem;
	grid-auto-columns: 1fr;
	grid-auto-flow: column;
	justify-content: center;
	> * {
		background: var(--light);
		border: 0;
		border-radius: 0.5rem;
		box-sizing: border-box;
		color: var(--black);
		cursor: pointer;
		font-size: 100%;
		margin: 0;
		padding: 0.5rem;
		text-align: center;
		text-decoration: none;
	}
	> input[type="file"] {
		display: none;
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
	faUpload,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

IconLibrary.add(faChevronLeft, faChevronRight, faUpload, faDownload, faTrash);

export default defineComponent({
	components: { FontAwesomeIcon },
	computed: {
		downloadData: function (): string {
			const preamble = "data:application/json;charset=utf-8,";
			return preamble + this.download;
		},
	},
	methods: {
		uploadData: function (uploadEvent: Event): void {
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
		onUpload: Function,
	},
});
</script>
