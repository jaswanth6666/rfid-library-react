import { useState, useEffect, useRef, RefObject } from 'react';

interface Options {
  threshold?: number;
  triggerOnce?: boolean;
}

// The only change is adding '| null' to the RefObject type in the return signature
export const useInView = (options: Options = { threshold: 0.1, triggerOnce: true }): [RefObject<HTMLDivElement | null>, boolean] => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      { threshold: options.threshold }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [options.threshold, options.triggerOnce]);

  return [ref, isInView];
};