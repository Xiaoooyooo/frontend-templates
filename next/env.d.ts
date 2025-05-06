declare module "*.svg?jsx" {
  const Component: React.FC<React.HTMLProps<SVGElement>>;
  export default Component;
}

type LayoutProps<T = Record<string, string>> = {
  params: Promise<T>;
  children: React.ReactNode;
};

type PageProps<
  T = Record<string, string>,
  U = Record<string, string | string[]>,
> = {
  params: Promise<T>;
  searchParams: Promise<U>;
};
