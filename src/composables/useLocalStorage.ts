import { computed, ComputedRef, reactive, UnwrapNestedRefs, watch } from "vue";

export class DataParseError extends Error {}

export default function useLocalStorage<T extends Record<string, unknown>>(
	index: string,
	pad: (t: Partial<T>) => T,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	guard: (t: any) => t is T
): { data: UnwrapNestedRefs<T>; stringified: ComputedRef<string> } {
	let importedData = {};
	if (localStorage[index] !== undefined) {
		importedData = JSON.parse(localStorage[index]);
		if (!guard(importedData)) {
			delete localStorage[index];
			throw new DataParseError(JSON.stringify(importedData));
		}
	}
	const vivifiedData = reactive(pad(importedData));
	const stringified = computed(() => {
		return JSON.stringify({ ...vivifiedData });
	});
	const saveData = () => (localStorage[index] = stringified.value);
	watch(vivifiedData, saveData, { deep: true });
	return {
		data: vivifiedData,
		stringified,
	};
}
