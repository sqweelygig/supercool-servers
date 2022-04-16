import { computed, ComputedRef, reactive, UnwrapNestedRefs, watch } from "vue";

export class DataParseError extends Error {}

function parse<T extends Record<string, unknown>>(
	str: string,
	pad: (t: Partial<T>) => T,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	guard: (t: any) => t is T
): T {
	const importedData = pad(JSON.parse(str));
	if (!guard(importedData)) {
		throw new DataParseError("Could not parse:" + str);
	}
	return importedData;
}

export default function useLocalStorage<Data extends Record<string, unknown>>(
	index: string,
	pad: (d: Partial<Data>) => Data,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	guard: (d: any) => d is Data,
	emit: (d: Data) => void,
	err: (error: Error) => void
): {
	clear: () => void;
	data: UnwrapNestedRefs<Data>;
	stringified: ComputedRef<string>;
	upload: (str: string) => void;
} {
	let importedData = pad({});
	if (localStorage[index] !== undefined) {
		try {
			importedData = parse(localStorage[index], pad, guard);
		} catch (error) {
			delete localStorage[index];
			err(error as Error);
		}
	}
	const vivifiedData = reactive(importedData);
	const stringified = computed(() => {
		return JSON.stringify({ ...vivifiedData });
	});
	const save = () => (localStorage[index] = stringified.value);
	watch(vivifiedData, save, { deep: true });
	const guardedEmit = () => {
		const t = { ...vivifiedData };
		if (guard(t)) emit(t);
	};
	guardedEmit();
	watch(vivifiedData, guardedEmit, { deep: true });
	const clear = () => {
		Object.assign(vivifiedData, pad({}));
	};
	const upload = (str: string) => {
		try {
			Object.assign(vivifiedData, parse(str, pad, guard));
		} catch (error) {
			err(error as Error);
		}
	};
	return {
		clear,
		data: vivifiedData,
		stringified,
		upload,
	};
}
