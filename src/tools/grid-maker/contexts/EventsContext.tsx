import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  BehaviorSubject,
  type Observable,
  Subject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  take,
} from 'rxjs';

import {
  type ConfigurationValues,
  DEFAULT_CONFIGURATION_VALUES,
  isSameConfiguration,
} from '@/tools/grid-maker/configurationValues';
import { Papers } from '@/tools/grid-maker/papers';
import { type Inch, type Pixel } from '@/tools/grid-maker/units';

export interface EventsContextValue {
  readonly onPaperKeyChange$: BehaviorSubject<keyof typeof Papers>;
  readonly onCellSizeChange$: BehaviorSubject<Inch>;
  readonly onFontSizeChange$: BehaviorSubject<Pixel>;
  readonly configuration$: Observable<ConfigurationValues>;
  readonly onPrint$: Subject<void>;
  readonly printConfiguration$: Observable<ConfigurationValues>;
  readonly paperKey$: BehaviorSubject<keyof typeof Papers>;
  readonly cellSize$: BehaviorSubject<Inch>;
  readonly fontSize$: BehaviorSubject<Pixel>;
}

const EventsContext = createContext<EventsContextValue | null>(null);

export interface EventsProviderProps {
  children: ReactNode;
  initialValues?: ConfigurationValues;
}

const DEBOUNCE_MS = 300;

export const EventsProvider: FC<EventsProviderProps> = ({
  children,
  initialValues,
}) => {
  // `useState` is used instead of `useMemo`. React can discard a `useMemo`
  // cache, and every subject here holds application state that must survive.
  const [subjects] = useState<EventsContextValue>(() => {
    const onPaperKeyChange$ = new BehaviorSubject<keyof typeof Papers>(
      initialValues?.paperKey ?? DEFAULT_CONFIGURATION_VALUES.paperKey,
    );
    const onCellSizeChange$ = new BehaviorSubject<Inch>(
      initialValues?.cellSize ?? DEFAULT_CONFIGURATION_VALUES.cellSize,
    );
    const onFontSizeChange$ = new BehaviorSubject<Pixel>(
      initialValues?.fontSize ?? DEFAULT_CONFIGURATION_VALUES.fontSize,
    );

    // `combineLatest` builds a new object for every emission, so the
    // comparator must look at the fields, not the reference.
    const configuration$ = combineLatest({
      paperKey: onPaperKeyChange$,
      cellSize: onCellSizeChange$,
      fontSize: onFontSizeChange$,
    }).pipe(
      debounceTime(DEBOUNCE_MS),
      distinctUntilChanged(isSameConfiguration),
    );

    const onPrint$ = new Subject<void>();

    // A print request waits for the configuration to settle. This stops a
    // print that starts inside the debounce window from printing the grid
    // drawn for the previous configuration.
    const printConfiguration$ = onPrint$.pipe(
      switchMap(() => configuration$.pipe(take(1))),
    );

    const paperKey$ = new BehaviorSubject<keyof typeof Papers>(
      onPaperKeyChange$.getValue(),
    );
    const cellSize$ = new BehaviorSubject<Inch>(onCellSizeChange$.getValue());
    const fontSize$ = new BehaviorSubject<Pixel>(onFontSizeChange$.getValue());

    return {
      onPaperKeyChange$,
      onCellSizeChange$,
      onFontSizeChange$,
      configuration$,
      onPrint$,
      printConfiguration$,
      paperKey$,
      cellSize$,
      fontSize$,
    };
  });

  useEffect(() => {
    const subscription = subjects.configuration$.subscribe((values) => {
      subjects.paperKey$.next(values.paperKey);
      subjects.cellSize$.next(values.cellSize);
      subjects.fontSize$.next(values.fontSize);
    });

    return () => subscription.unsubscribe();
  }, [subjects]);

  return (
    <EventsContext.Provider value={subjects}>{children}</EventsContext.Provider>
  );
};

EventsProvider.displayName = 'EventsProvider';

export function useEvents(): EventsContextValue {
  const context = useContext(EventsContext);

  if (!context) {
    throw new Error('useEvents must be used inside an EventsProvider');
  }

  return context;
}
