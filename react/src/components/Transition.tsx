import {
  cloneElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type JSX,
} from "react";
import { createPortal } from "react-dom";
import useLatestRef from "@/lib/hooks/useLatestRef";
import useMergeRefs from "@/lib/hooks/useMergeRefs";
import clsm from "@/lib/utils/clsm";

const STAGE = {
  BeforeEnter: 1,
  Entering: 2,
  Entered: 3,
  BeforeLeave: 4,
  Leaving: 5,
  Left: 6,
  Unmounted: 7,
};

type TransitionClassProps = {
  [K in keyof Omit<
    typeof STAGE,
    "Unmounted"
  > as `${Uncapitalize<K>}ClassName`]: string;
};

type TransitionProps = Partial<TransitionClassProps> & {
  visible: boolean;
  children: JSX.Element;
  unmountOnHide?: boolean;
  appear?: boolean;
  mountOnBody?: boolean;
};

export default function Transition(props: TransitionProps) {
  const {
    visible,
    children,
    unmountOnHide,
    appear,
    mountOnBody,
    // classes
    beforeEnterClassName,
    enteringClassName,
    enteredClassName,
    beforeLeaveClassName,
    leavingClassName,
    leftClassName,
  } = props;
  const [stage, setStage] = useState<number>(
    visible
      ? appear
        ? STAGE.Left
        : STAGE.Entered
      : unmountOnHide
        ? STAGE.Unmounted
        : STAGE.Left,
  );
  const { className: _className, ref, ...rest } = children.props;
  const elRef = useRef<HTMLElement>(null);

  const optionsRef = useLatestRef({ stage, unmountOnHide });
  const transitionEndCallbackRef = useRef<() => void>(null);
  const mergedRef = useMergeRefs(elRef, ref);

  const bindTransitionEndCallback = useCallback((callback: () => void) => {
    const el = elRef.current;
    if (!el) {
      throw new Error("[Transition]: Can not access target's dom element.");
    }
    if (transitionEndCallbackRef.current) {
      el.removeEventListener("transitionend", transitionEndCallbackRef.current);
    }
    const handler = () => {
      console.log("transitionend");
      callback();
      transitionEndCallbackRef.current = null;
      el?.removeEventListener("transitionend", handler);
    };
    transitionEndCallbackRef.current = handler;
    el.addEventListener("transitionend", handler);
  }, []);

  useLayoutEffect(() => {
    const { unmountOnHide } = optionsRef.current;
    if (visible) {
      if (stage === STAGE.Left || stage === STAGE.Unmounted) {
        setStage(STAGE.BeforeEnter);
        requestAnimationFrame(() => {
          setStage(STAGE.Entering);
        });
      } else if (stage === STAGE.Leaving) {
        setStage(STAGE.Entering);
      } else if (stage === STAGE.Entering) {
        bindTransitionEndCallback(() => {
          setStage(STAGE.Entered);
        });
      }
    } else {
      if (stage === STAGE.Entered) {
        setStage(STAGE.BeforeLeave);
        requestAnimationFrame(() => {
          setStage(STAGE.Leaving);
        });
      } else if (stage === STAGE.Entering) {
        setStage(STAGE.Leaving);
      } else if (stage === STAGE.Leaving) {
        bindTransitionEndCallback(() => {
          setStage(unmountOnHide ? STAGE.Unmounted : STAGE.Left);
        });
      }
    }
  }, [visible, stage, optionsRef, bindTransitionEndCallback]);

  if (stage === STAGE.Unmounted) {
    return null;
  }

  const className = clsm(
    _className,
    stage === STAGE.BeforeEnter && [beforeEnterClassName],
    stage === STAGE.Entering && [enteringClassName, enteredClassName],
    stage === STAGE.Entered && [enteredClassName],
    stage === STAGE.BeforeLeave && [beforeLeaveClassName],
    stage === STAGE.Leaving && [leavingClassName, leftClassName],
    stage === STAGE.Left && [leftClassName],
  );

  const element = cloneElement(children, {
    className,
    ref: mergedRef,
    ...rest,
  });

  return mountOnBody ? createPortal(element, document.body) : element;
}
