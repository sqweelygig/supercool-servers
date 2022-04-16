import { ComputedRef, UnwrapNestedRefs, Ref } from "vue";
import useErrorCapture from "@/composables/useErrorCapture";
import useLocalStorage from "@/composables/useLocalStorage";

export default function useDataBoundary<
	Data extends Record<string, unknown>,
	Emit
>(
	index: string,
	pad: (d: Partial<Data>) => Data,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	guard: (d: any) => d is Data,
	convert: (d: Data) => Emit,
	emit: (e: Emit) => void
): {
	clear: undefined;
	clearData: () => void;
	clearError: () => void;
	data: UnwrapNestedRefs<Data>;
	error: Ref<Error | undefined>;
	stringified: ComputedRef<string>;
	upload: (str: string) => void;
} {
	const errorBoundary = useErrorCapture();
	const tryEmission = (d: Data) => {
		try {
			emit(convert(d));
		} catch (error) {
			console.warn(error);
		}
	};
	const store = useLocalStorage(
		index,
		pad,
		guard,
		tryEmission,
		errorBoundary.capture
	);
	return {
		...store,
		...errorBoundary,
		// Avert a namespace collision
		clear: undefined,
		clearData: store.clear,
		clearError: errorBoundary.clear,
	};
}
