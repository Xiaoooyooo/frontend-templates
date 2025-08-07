import type { HTMLProps } from "react";
import clsm from "@/lib/utils/clsm";

type ContainerProps = HTMLProps<HTMLDivElement>;
export default function Container(props: ContainerProps) {
  const { className, ...rest } = props;
  return (
    <div
      className={clsm(
        "mx-auto w-full px-4 lg:w-[1000px] xl:w-[1140px] xl:px-0",
        className,
      )}
      {...rest}
    />
  );
}
