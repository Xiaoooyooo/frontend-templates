import type { HTMLProps } from "react";
import { clsm } from "@/lib/utils/helpers";

type ContainerProps = HTMLProps<HTMLDivElement>;
export default function Container(props: ContainerProps) {
  const { className, ...rest } = props;
  return (
    <div
      className={clsm(
        "mx-auto w-full px-4 lg:w-250 xl:w-285 xl:px-0",
        className,
      )}
      {...rest}
    />
  );
}
