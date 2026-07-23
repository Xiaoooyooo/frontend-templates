import { useCallback, useEffect, useRef, useState } from "react";
import useLatestRef from "./useLatestRef";

type BaseOptions<P = void, R = unknown> = {
  immediate?: boolean;
  initialPayload?: P;
  onSuccess?: (data: R) => void;
  onError?: (error: any) => void;
};

type FetchStatus = "idle" | "loading" | "success" | "failure";

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
  refetch: P extends void ? () => Promise<void> : (payload: P) => Promise<void>;
  cancel: () => void;
};

class CancelFetchError extends Error {
  constructor() {
    super("Fetch Cancelled");
  }
}

export default function useFetch<P = void, R = unknown>(
  options: UseFetchOptions<P, R>,
): UseFetchReturn<P, R>;

export default function useFetch(options: UseFetchOptions<any, any>) {
  const runId = useRef(0); // handle Race Condition
  const [state, setState] = useState<{
    status: FetchStatus;
    data: any;
    error: any;
  }>({
    status: "idle",
    data: null,
    error: null,
  });
  const abortControllerRef = useRef<AbortController>(null);

  const optionsRef = useLatestRef(options);
  const statusRef = useLatestRef(state.status);

  const handle = useCallback(async (...args: any[]) => {
    const id = ++runId.current;
    const { fetchFn, onSuccess, onError } = optionsRef.current;
    const prevStatus = statusRef.current;
    if (abortControllerRef.current) {
      // cancel previous pending request
      abortControllerRef.current.abort(new CancelFetchError());
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    setState((prev) => ({ ...prev, status: "loading" }));
    let data: any = null;
    let error: any = null;
    let status: FetchStatus;
    try {
      data = await fetchFn({ payload: args[0], signal });
      status = "success";
    } catch (e) {
      error = e;
      status = "failure";
    }
    if (id !== runId.current) return; // ignore outdated request
    if (error instanceof CancelFetchError) {
      // ignore cancelled request
      setState((prev) => ({ ...prev, status: prevStatus }));
      return;
    }
    setState({ status, data, error });
    if (status === "success") onSuccess?.(data);
    if (status === "failure") onError?.(error);
    abortControllerRef.current = null;
  }, []); // eslint-disable-line

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(new CancelFetchError());
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const { immediate, initialPayload } = options;
    if (immediate) {
      initialPayload ? handle(initialPayload) : handle(); // eslint-disable-line
    }

    return () => {
      cancel();
    };
  }, []); // eslint-disable-line

  const { status, data, error } = state;
  const isIdle = status === "idle";
  const isError = status === "failure";
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
