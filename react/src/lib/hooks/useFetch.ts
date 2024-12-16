import { useCallback, useState } from "react";
import useLatestRef from "./useLatestRef";
import useOnMounted from "./useOnMounted";

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
  fetchFn: (payload: P) => Promise<U>;
  initialPayload?: P;
};

type OptionsWithoutPayload<U = unknown> = BaseOptions<U> & {
  fetchFn: () => Promise<U>;
  initialPayload?: undefined;
};

type ReturnWithPayload<P = unknown, U = unknown> = BaseReturnValue<U> & {
  refetch: (payload: P) => void;
};
type ReturnWithoutPayload<U = unknown> = BaseReturnValue<U> & {
  refetch: () => void;
};

type FetchFnWithPayload = (payload: any) => Promise<any>;
type FetchFnWithoutPayload = () => Promise<any>;
type GetPayload<F extends (payload: any) => any> = Parameters<F>[0];
type GetReturn<F extends (...args: any) => Promise<any>> = Awaited<
  ReturnType<F>
>;

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

  const optionsRef = useLatestRef(options);

  const handle = useCallback(
    (payload?: any) => {
      const { fetchFn, onSuccess, onError } = optionsRef.current;
      setLoading(true);
      fetchFn(payload)
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

  useOnMounted(() => {
    if (options.immediate) {
      handle(options.initialPayload as any);
    }
  });

  return {
    data,
    error,
    isError,
    isSuccess,
    refetch: handle,
    isLoading: loading,
    isPending: !loading && !data && !error,
  };
}
