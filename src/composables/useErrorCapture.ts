import { ref, Ref } from "vue";

export default function useErrorCapture(): {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	capture: (error: Error, component?: any, information?: any) => void;
	clear: () => void;
	error: Ref<Error | undefined>;
} {
	const error = ref(undefined as Error | undefined);
	const clear = () => {
		error.value = undefined;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	const capture = (e: Error, c?: any, i?: any) => {
		console.warn(e, c, i);
		error.value = e;
	};
	return { error, clear, capture };
}
