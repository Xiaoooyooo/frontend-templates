import {
  cloneElement,
  useLayoutEffect,
  useRef,
  useState,
  type JSX,
} from "react";
import Transition, { type TransitionClassProps } from "./Transition";

type TransitionGroupProps = Partial<TransitionClassProps> & {
  children: JSX.Element | JSX.Element[];
  appear?: boolean;
};

export default function TransitionGroup(props: TransitionGroupProps) {
  const { children, appear = false, ...rest } = props;
  const [current, setCurrent] = useState<JSX.Element[]>(() =>
    getList(children),
  );
  const visibleChildrenRef = useRef(new Set());
  const prevRenderTimeRef = useRef<number>(null);

  useLayoutEffect(() => {
    const now = Date.now();
    // 如果在 React 严格模式下，渲染两次间隔过短（< 16ms），跳过第二次渲染
    if (prevRenderTimeRef.current && now - prevRenderTimeRef.current < 16) {
      return;
    }
    prevRenderTimeRef.current = now;
    const _children = getList(children);
    const oldKeys = new Set(current.map((c) => getKey(c)));
    const newKeys = new Set(_children.map((c) => getKey(c)));

    const newChildren: JSX.Element[] = [];

    for (
      let i = 0, j = 0;
      i < current.length || j < _children.length;
      i++, j++
    ) {
      // 批量处理离开的
      while (current[i] && !newKeys.has(getKey(current[i]))) {
        newChildren.push(current[i++]);
      }
      // 批量处理进入的
      while (_children[j] && !oldKeys.has(getKey(_children[j]))) {
        newChildren.push(_children[j++]);
      }

      // 移动的以新 children 为准
      if (_children[j]) {
        newChildren.push(_children[j]);
      }
    }

    visibleChildrenRef.current = newKeys;
    setCurrent(newChildren);
  }, [children]); // eslint-disable-line

  return current.map((child) => (
    <Transition
      key={child.key}
      visible={visibleChildrenRef.current.has(child.key)}
      appear
      onExited={() => setCurrent((p) => p.filter((_) => _.key !== child.key))}
      {...rest}
    >
      {cloneElement(child, { ...child.props })}
    </Transition>
  ));
}

function getKey(element: JSX.Element) {
  if (!element.key)
    throw new Error("Each child of TransitionGroup must have a unique 'key'");
  return String(element.key);
}

function getList(children: JSX.Element | JSX.Element[] | null | undefined) {
  if (!children) return [];
  return Array.isArray(children) ? children : [children];
}
