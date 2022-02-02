<template>
	<div class="tool-ribbon">
		<button v-if="this.onBack" type="button" v-on:click.prevent="this.onBack">
			<font-awesome-icon icon="chevron-left" />
		</button>
		<a
			v-if="this.download"
			download="thermal-data.json"
			v-bind:href="this.downloadData"
		>
			<font-awesome-icon icon="download" />
		</a>
		<label v-if="this.onUpload" for="file-upload">
			<font-awesome-icon icon="upload" />
		</label>
		<input
			v-if="this.onUpload"
			id="file-upload"
			type="file"
			v-on:change="uploadData($event.target.files[0])"
		/>
		<button v-if="this.onClear" type="button" v-on:click.prevent="this.onClear">
			<font-awesome-icon icon="trash" />
		</button>
		<button v-if="this.onNext" type="button" v-on:click.prevent="this.onNext">
			<font-awesome-icon icon="chevron-right" />
		</button>
	</div>
</template>

<style scoped lang="scss">
.tool-ribbon {
	display: grid;
	gap: 1rem;
	grid-auto-columns: 3rem;
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
		padding: 0.5rem;
		text-decoration: none;
	}
	> input[type="file"] {
		display: none;
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
		uploadData: function (file: File): void {
			const reader = new FileReader();
			reader.addEventListener("load", (event) => {
				if (typeof event?.target?.result === "string" && this.onUpload) {
					this.onUpload(event.target.result);
				}
			});
			reader.readAsText(file);
		},
	},
	props: {
		download: {
			type: String || null,
		},
		onBack: {
			type: Function || null,
		},
		onClear: {
			type: Function || null,
		},
		onNext: {
			type: Function || null,
		},
		onUpload: {
			type: Function || null,
		},
	},
});
</script>
