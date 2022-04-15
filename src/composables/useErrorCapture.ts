import { ref, Ref } from "vue";

export default function useErrorCapture(): {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	capture: (error: any, component?: any, information?: any) => void;
	clear: () => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	error: Ref<any>;
} {
	const error = ref(undefined);
	const clear = () => {
		error.value = undefined;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	const capture = (e: any, c?: any, i?: any) => {
		console.warn(e, c, i);
		error.value = e;
	};
	return { error, clear, capture };
}
