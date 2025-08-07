import { Component, createRef, type PropsWithChildren } from "react";
import Container from "./Container";

type ErrorBoundaryState = {
  error: Error | null;
  viewDetail: boolean;
};

export default class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  elRef = createRef<HTMLDivElement>();
  state: ErrorBoundaryState = {
    error: null,
    viewDetail: false,
  };
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    __DEV__ && console.log({ error, errorInfo });
    this.setState({ error });
  }
  render(): React.ReactNode {
    const { error, viewDetail } = this.state;

    if (error) {
      return (
        <Container className="h-[calc(100dvh_-_4rem)] py-10">
          <p className="my-2 text-center text-3xl">😥</p>
          <p className="text-center text-sm">
            网站似乎遇到了一个不可恢复的错误，请尝试刷新页面。如果问题依旧存在，请尝试联系管理人员。
          </p>
          <div className="my-4 flex justify-center gap-x-2">
            <button
              className="cursor-pointer rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs transition-colors hover:bg-zinc-200 active:bg-zinc-300"
              onClick={() => this.setState({ viewDetail: !viewDetail })}
            >
              点击查看错误详情
            </button>
            <button
              className="cursor-pointer rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs transition-colors hover:bg-zinc-200 active:bg-zinc-300"
              onClick={() => window.location.reload()}
            >
              刷新页面
            </button>
          </div>
          {viewDetail && (
            <div className="overflow-auto" ref={this.elRef}>
              <div className="rounded-md border border-red-400 bg-red-100 p-4 text-red-400">
                <p>{error.message}</p>
                <pre>
                  <code>{error.stack}</code>
                </pre>
              </div>
            </div>
          )}
        </Container>
      );
    }

    return this.props.children;
  }
}
