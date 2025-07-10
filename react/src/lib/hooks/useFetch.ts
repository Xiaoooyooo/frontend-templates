import { useCallback, useEffect, useRef, useState } from "react";
import useLatestRef from "./useLatestRef";

type BaseOptions<P = void, R = unknown> = {
  immediate?: boolean;
  initialPayload?: P;
  onSuccess?: (data: R) => void;
  onError?: (error: any) => void;
};

type BaseReturnValue<T> =
  | {
      // initial
      data: null;
      error: null;
      isError: false;
      isSuccess: false;
      isLoading: false;
      isIdle: true;
    }
  | {
      // success
      data: T;
      error: null;
      isError: false;
      isSuccess: true;
      isLoading: false;
      isIdle: false;
    }
  | {
      // failed
      data: null;
      error: any;
      isError: true;
      isSuccess: false;
      isLoading: false;
      isIdle: false;
    }
  | {
      // loading
      data: T | null;
      error: any | null;
      isError: false;
      isSuccess: false;
      isLoading: true;
      isIdle: false;
    };

export type UseFetchContext<P = void> = {
  signal: AbortSignal;
  payload: P;
};

type FetchFn<P = void, R = any> = (context: UseFetchContext<P>) => Promise<R>;

type UseFetchOptions<P = void, R = unknown> = BaseOptions<P, R> & {
  fetchFn: FetchFn<P, R>;
};

type UseFetchReturn<P, R> = BaseReturnValue<R> & {
  refetch: P extends void ? () => void : (payload: P) => void;
  cancel: () => void;
};

export default function useFetch<P = void, R = unknown>(
  options: UseFetchOptions<P, R>,
): UseFetchReturn<P, R>;

export default function useFetch(options: UseFetchOptions) {
  const runId = useRef(0); // handle Race Condition
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<any | null>(null);
  const abortControllerRef = useRef<AbortController>(null);

  const optionsRef = useLatestRef(options);

  const handle = useCallback(
    (...args: any[]) => {
      const id = ++runId.current;
      const { fetchFn, onSuccess, onError } = optionsRef.current;
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      setStatus("loading");
      fetchFn({ payload: args[0], signal })
        .then((data) => {
          // Another task has started, ignore the old state
          if (id !== runId.current) return;
          setData(data);
          setError(null);
          setStatus("success");
          onSuccess?.(data);
          abortControllerRef.current = null;
        })
        .catch((error) => {
          if (id !== runId.current) return;
          setStatus("error");
          setData(null);
          setError(error);
          onError?.(error);
          abortControllerRef.current = null;
        });
    },
    [optionsRef],
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(new Error("Fetch Cancelled"));
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const { immediate, initialPayload } = options;
    if (immediate) {
      initialPayload ? handle(initialPayload) : handle();
    }

    return () => {
      cancel();
    };
  }, []);

  const isIdle = status === "idle";
  const isError = status === "error";
  const isSuccess = status === "success";
  const isLoading = status === "loading";

  return {
    data,
    error,
    cancel,
    isIdle,
    isError,
    isLoading,
    isSuccess,
    refetch: handle,
  };
}
