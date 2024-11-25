type RequestOption = {
  method?: string;
  timeout?: number;
  signal?: AbortSignal;
  params?: Record<string, string> | string[][];
  headers?: [string, string][] | Record<string, string>;
  data?: Blob | FormData | Record<string, unknown> | string;
};

type NormalRequestOption = {
  stream?: false;
};

type StreamRequestOption = {
  stream: true;
};

export default async function request<T>(
  url: string,
  options?: RequestOption & NormalRequestOption,
): Promise<T>;
export default async function request(
  url: string,
  options?: RequestOption & StreamRequestOption,
): Promise<ReadableStream<Uint8Array>>;
export default async function request(
  url: string,
  options: RequestOption & (NormalRequestOption | StreamRequestOption) = {},
) {
  const {
    method = "get",
    timeout = 0,
    signal,
    params,
    headers,
    data,
    stream = false,
  } = options;

  let abortSignal: AbortSignal | undefined = signal;

  if (timeout !== 0) {
    const abortController = new AbortController();
    const abort = () =>
      !abortController.signal.aborted && abortController.abort();
    abortSignal = abortController.signal;
    let timer: ReturnType<typeof setTimeout> | undefined = setTimeout(() => {
      abort();
      timer = undefined;
    }, timeout);
    signal?.addEventListener("abort", function () {
      abort();
      typeof timer !== "undefined" && clearTimeout(timer);
    });
  }

  let search = "";
  if (params) {
    const searchParams = new URLSearchParams(params);
    search = "?" + searchParams.toString();
  }

  const _headers = new Headers(headers);
  let body: BodyInit | undefined;
  if (
    typeof data === "string" ||
    data instanceof Blob ||
    data instanceof FormData
  ) {
    body = data;
  } else if (data && typeof data === "object") {
    _headers.append("Content-Type", "application/json");
    body = JSON.stringify(data);
  }

  const response = await fetch(url + search, {
    method,
    headers: _headers,
    signal: abortSignal,
    body,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = /json/.test(contentType);
  const isText = /text/.test(contentType);

  if (!response.ok) {
    throw await (isJson ? response.json() : response.text());
  }

  if (stream) {
    return response.body;
  }

  if (isJson) {
    return await response.json();
  }

  if (isText) {
    return await response.text();
  }

  return await response.blob();
}
