import { useCallback, useRef, useState } from "react";
import useLatestRef from "./useLatestRef";
import useOnMounted from "./useOnMounted";

type FetchFnWithPayload<P = any, U = any> = (
  payload: P,
  signal: AbortSignal,
) => Promise<U>;
type FetchFnWithoutPayload<U = any> = (signal: AbortSignal) => Promise<U>;
type GetPayload<F extends (payload: any, ...args: any) => any> =
  Parameters<F>[0];
type GetReturn<F extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<F>
>;

type BaseOptions<R> = {
  immediate?: boolean;
  onSuccess?: (data: R) => void;
  onError?: (error: any) => void;
};

type BaseReturnValue<T> =
  | {
      // success
      data: T;
      error: null;
      isError: false;
      isSuccess: true;
      isLoading: false;
      isPending: false;
    }
  | {
      // failed
      data: null;
      error: any;
      isError: true;
      isSuccess: false;
      isLoading: false;
      isPending: false;
    }
  | {
      // not triggered
      data: null;
      error: null;
      isError: false;
      isSuccess: false;
      isLoading: false;
      isPending: true;
    }
  | {
      // first time loading
      data: null;
      error: null;
      isError: false;
      isSuccess: false;
      isLoading: true;
      isPending: true;
    }
  | {
      // loading, previous state is success
      data: T;
      error: null;
      isError: false;
      isSuccess: true;
      isLoading: true;
      isPending: false;
    }
  | {
      // loading, previous state is failed
      data: null;
      error: any;
      isError: true;
      isSuccess: false;
      isLoading: true;
      isPending: false;
    };

type OptionsWithPayload<P = unknown, U = unknown> = BaseOptions<U> & {
  fetchFn: (payload: P, signal: AbortSignal) => Promise<U>;
  initialPayload?: P;
};

type OptionsWithoutPayload<U = unknown> = BaseOptions<U> & {
  fetchFn: (signal: AbortSignal) => Promise<U>;
  initialPayload?: undefined;
};

type ReturnWithPayload<P = unknown, U = unknown> = BaseReturnValue<U> & {
  refetch: (payload: P) => void;
  cancel: () => void;
};
type ReturnWithoutPayload<U = unknown> = BaseReturnValue<U> & {
  refetch: () => void;
  cancel: () => void;
};

export default function useFetch<
  F extends FetchFnWithoutPayload = FetchFnWithoutPayload,
  U = GetReturn<F>,
>(options: OptionsWithoutPayload<U>): ReturnWithoutPayload<U>;
export default function useFetch<
  F extends FetchFnWithPayload = FetchFnWithPayload,
  P = GetPayload<F>,
  U = GetReturn<F>,
>(options: OptionsWithPayload<P, U>): ReturnWithPayload<P, U>;
export default function useFetch(
  options: OptionsWithoutPayload | OptionsWithPayload,
) {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const abortControllerRef = useRef<AbortController>(undefined);

  const optionsRef = useLatestRef(options);

  const handle = useCallback(
    (...args: any[]) => {
      const { fetchFn, onSuccess, onError } = optionsRef.current;
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      setLoading(true);
      (!args.length
        ? (fetchFn as FetchFnWithoutPayload)(signal)
        : (fetchFn as FetchFnWithPayload)(args[0], signal)
      )
        .then((data) => {
          setError(null);
          setIsError(false);
          setData(data as any);
          setIsSuccess(true);
          setLoading(false);
          onSuccess?.(data);
        })
        .catch((error) => {
          setError(error);
          setIsError(true);
          setData(null);
          setIsSuccess(false);
          setLoading(false);
          onError?.(error);
        });
    },
    [optionsRef],
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort("Fetch Cancelled");
      abortControllerRef.current = undefined;
    }
  }, []);

  useOnMounted(() => {
    if (options.immediate) {
      options.initialPayload ? handle(options.initialPayload as any) : handle();
    }
    return () => {
      cancel();
    };
  });

  return {
    data,
    error,
    isError,
    isSuccess,
    refetch: handle,
    isLoading: loading,
    isPending: !isSuccess && !isError,
    cancel,
  };
}
