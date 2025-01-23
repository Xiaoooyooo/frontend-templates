import { onMounted, type Ref, ref } from "vue";

type FetchFnWithPayload<P = unknown, R = unknown> = (
  payload: P,
  signal: AbortSignal,
) => Promise<R>;
type FetchFnWithoutPayload<R = unknown> = (signal: AbortSignal) => Promise<R>;

type GetPayload<F extends (payload: any, ...args: any) => any> =
  Parameters<F>[0];
type GetResult<F extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<F>
>;

type UseFetchBaseOptions<T> = {
  immediate?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any, isCancelled: boolean) => void;
};

type UseFetchWithPayloadOptions<
  P = unknown,
  R = unknown,
> = UseFetchBaseOptions<R> & {
  fetchFn: (payload: P, signal: AbortSignal) => Promise<R>;
  initialPaylod?: P;
};

type UseFetchWithoutPayloadOptions<R = unknown> = UseFetchBaseOptions<R> & {
  fetchFn: (signal: AbortSignal) => Promise<R>;
  initialPaylod?: undefined;
};

type UseFetchBaseResult<T> = {
  isLoading: Ref<boolean>;
  isPending: Ref<boolean>;
  isSuccess: Ref<boolean>;
  isError: Ref<boolean>;
  data: Ref<T | null>;
  error: Ref<any>;
};

type UseFetchWithPayloadResult<
  P = unknown,
  R = unknown,
> = UseFetchBaseResult<R> & {
  refetch: (payload: P) => void;
  cancel: () => void;
};
type UseFetchWithoutPayloadResult<R = unknown> = UseFetchBaseResult<R> & {
  refetch: () => void;
  cancel: () => void;
};

class CancelFetchError extends Error {
  name = "CancelFetchError";
}

export default function useFetch<
  F extends FetchFnWithoutPayload,
  R = GetResult<F>,
>(options: UseFetchWithoutPayloadOptions<R>): UseFetchWithoutPayloadResult<R>;
export default function useFetch<
  F extends FetchFnWithPayload,
  P = GetPayload<F>,
  R = GetResult<F>,
>(options: UseFetchWithPayloadOptions<P, R>): UseFetchWithPayloadResult<P, R>;
export default function useFetch(
  options: UseFetchWithPayloadOptions | UseFetchWithoutPayloadOptions,
) {
  const isPending = ref(true);
  const isLoading = ref(false);
  const isSuccess = ref(false);
  const isError = ref(false);
  const data = ref<any>(null);
  const error = ref<any>(null);
  const abortController = ref<AbortController | null>(null);

  function handler(...args: any[]) {
    const { fetchFn, onError, onSuccess } = options;
    abortController.value = new AbortController();
    isLoading.value = true;
    (args.length === 0
      ? (fetchFn as FetchFnWithoutPayload)(abortController.value.signal)
      : (fetchFn as FetchFnWithPayload)(args[0], abortController.value.signal)
    )
      .then((_data) => {
        onSuccess?.(_data);
        isLoading.value = false;
        isPending.value = false;
        data.value = _data;
        error.value = null;
      })
      .catch((_error) => {
        onError?.(_error, _error instanceof CancelFetchError);
        isLoading.value = false;
        isPending.value = false;
        error.value = _error;
        data.value = null;
      });
  }

  function cancel() {
    if (abortController.value) {
      abortController.value.abort(new CancelFetchError());
      abortController.value = null;
    }
  }

  onMounted(() => {
    const { immediate, initialPaylod } = options;
    if (immediate) {
      !!initialPaylod ? handler(initialPaylod) : handler();
    }
  });

  return {
    isPending,
    isLoading,
    isSuccess,
    isError,
    data,
    error,
    refetch: handler,
    cancel,
  };
}
