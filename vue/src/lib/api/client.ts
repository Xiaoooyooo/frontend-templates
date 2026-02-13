type ApiClientOptions = {
  baseURL?: string;
  timeout?: number;
};

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

class ApiClient {
  constructor(private readonly options: ApiClientOptions = {}) {}

  async request<T>(
    url: string,
    options?: RequestOption & NormalRequestOption,
  ): Promise<T>;
  async request(
    url: string,
    options?: RequestOption & StreamRequestOption,
  ): Promise<ReadableStream<Uint8Array>>;
  async request(
    url: string,
    options: RequestOption & (NormalRequestOption | StreamRequestOption) = {},
  ) {
    const {
      method = "get",
      timeout = this.options.timeout ?? 0,
      signal,
      params,
      headers,
      data,
      stream = false,
    } = options;

    let abortSignal: AbortSignal | undefined = signal;

    if (timeout !== 0) {
      const abortController = new AbortController();
      abortSignal = abortController.signal;
      const abort = function () {
        if (!abortController.signal.aborted) abortController.abort();
      };
      const timer = setTimeout(() => {
        abort();
      }, timeout);
      signal?.addEventListener("abort", function () {
        if (abortController.signal.aborted) return;
        abort();
        clearTimeout(timer);
      });
    }

    // handle querystring
    let search = "";
    if (params) {
      const searchParams = new URLSearchParams(params);
      search = "?" + searchParams.toString();
    }

    // handle headers
    const _headers = new Headers(headers);

    // handle body
    let body: BodyInit | undefined;
    if (
      typeof data === "string" ||
      data instanceof Blob ||
      data instanceof FormData
    ) {
      body = data;
    } else if (data && typeof data === "object") {
      if (!_headers.has("Content-Type"))
        _headers.append("Content-Type", "application/json");
      body = JSON.stringify(data);
    }

    const response = await fetch((this.options.baseURL ?? "") + url + search, {
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

    if (stream) return response.body;

    if (isJson) return response.json();

    if (isText) return response.text();

    return response.blob();
  }
}

export const apiClient = new ApiClient();

export default async function request<T>(
  url: string,
  options?: RequestOption & NormalRequestOption,
): Promise<T>;
export default async function request(
  url: string,
  options?: RequestOption & StreamRequestOption,
): Promise<ReadableStream<Uint8Array>>;
export default function request(url: string, options?: any) {
  return apiClient.request(url, options);
}
