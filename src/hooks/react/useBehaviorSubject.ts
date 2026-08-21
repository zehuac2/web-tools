import { useSyncExternalStore } from 'react';
import { BehaviorSubject } from 'rxjs';

/**
 * Subscribe to a behavior subject.
 */
function useBehaviorSubject<T>(subject: BehaviorSubject<T>): T {
  return useSyncExternalStore(
    (onStoreChange) => {
      const subscription = subject.subscribe(onStoreChange);
      return () => subscription.unsubscribe();
    },
    () => subject.getValue(),
  );
}

export default useBehaviorSubject;
