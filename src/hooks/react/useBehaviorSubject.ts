import { useCallback, useSyncExternalStore } from 'react';
import { BehaviorSubject } from 'rxjs';

/**
 * Subscribe to a behavior subject.
 */
function useBehaviorSubject<T>(subject: BehaviorSubject<T>): T {
  // The callbacks are memoized on the subject. A new callback identity makes
  // `useSyncExternalStore` resubscribe on every render.
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const subscription = subject.subscribe(onStoreChange);
      return () => subscription.unsubscribe();
    },
    [subject],
  );
  const getSnapshot = useCallback(() => subject.getValue(), [subject]);

  return useSyncExternalStore(subscribe, getSnapshot);
}

export default useBehaviorSubject;
