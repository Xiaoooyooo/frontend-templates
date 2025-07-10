import {
  cloneElement,
  useCallback,
  useEffect,
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
  BeforeEnter: "BeforeEnter",
  Entering: "Entering",
  Entered: "Entered",
  BeforeLeave: "BeforeLeave",
  Leaving: "Leaving",
  Left: "Left",
  Unmounted: "Unmounted",
};

export type TransitionClassProps = {
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
  onEntered?: () => void;
  onExited?: () => void;
};

export default function Transition(props: TransitionProps) {
  const {
    visible,
    children,
    unmountOnHide,
    appear,
    mountOnBody,
    onEntered,
    onExited,
    // classes
    beforeEnterClassName,
    enteringClassName,
    enteredClassName,
    beforeLeaveClassName,
    leavingClassName,
    leftClassName,
  } = props;
  const [stage, setStage] = useState<string>(
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

  const optionsRef = useLatestRef({ unmountOnHide, onEntered, onExited });
  const transitionEndCallbackRef = useRef<() => void>(null);
  const mergedRef = useMergeRefs(elRef, ref);
  const transitionTimeoutRef = useRef<Timer | null>(null);

  const bindTransitionEndCallback = useCallback((callback: () => void) => {
    const el = elRef.current;
    if (!el) {
      throw new Error("[Transition]: Cannot access target's DOM element.");
    }

    if (transitionEndCallbackRef.current) {
      el.removeEventListener("transitionend", transitionEndCallbackRef.current);
    }
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    const handler = () => {
      callback();
      transitionEndCallbackRef.current = null;
      el?.removeEventListener("transitionend", handler);
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };

    transitionEndCallbackRef.current = handler;
    el.addEventListener("transitionend", handler);

    // 动画超时兜底
    const computedDuration =
      parseFloat(getComputedStyle(el).transitionDuration || "0") * 1000;
    const fallbackDuration = isNaN(computedDuration)
      ? 300
      : Math.max(computedDuration, 50);
    transitionTimeoutRef.current = setTimeout(handler, fallbackDuration + 10);
  }, []);

  useLayoutEffect(() => {
    const { unmountOnHide, onEntered, onExited } = optionsRef.current;
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
          onEntered?.();
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
          onExited?.();
          setStage(unmountOnHide ? STAGE.Unmounted : STAGE.Left);
        });
      }
    }
  }, [visible, stage, optionsRef, bindTransitionEndCallback]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

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
