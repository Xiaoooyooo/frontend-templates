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

export class ApiClient {
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
      signal: _signal,
      params,
      headers: _headers,
      data,
      stream = false,
    } = options;

    let signal = _signal;
    if (_signal && timeout > 0) {
      signal = AbortSignal.any([_signal, AbortSignal.timeout(timeout)]);
    }

    // handle querystring
    let search = "";
    if (params) {
      const searchParams = new URLSearchParams(params);
      search = "?" + searchParams.toString();
    }

    // handle headers
    const headers = new Headers(_headers);

    // handle body
    let body: BodyInit | undefined;
    if (
      typeof data === "string" ||
      data instanceof Blob ||
      data instanceof FormData
    ) {
      body = data;
    } else if (data && typeof data === "object") {
      if (!headers.has("Content-Type"))
        headers.append("Content-Type", "application/json");
      body = JSON.stringify(data);
    }

    const response = await fetch((this.options.baseURL ?? "") + url + search, {
      method,
      headers,
      signal,
      body,
    });

    let responseData: any;
    const contentType = response.headers.get("content-type") || "";
    if (stream || /text\/event-stream/.test(contentType)) {
      responseData = response.body;
    } else if (/application\/json/.test(contentType)) {
      responseData = await response.json();
    } else if (/text\/.*/.test(contentType)) {
      responseData = await response.text();
    } else {
      responseData = await response.blob();
    }

    if (!response.ok) {
      throw responseData;
    }

    return responseData;
  }
}

const client = new ApiClient({
  timeout: 10000,
});

export default client;
