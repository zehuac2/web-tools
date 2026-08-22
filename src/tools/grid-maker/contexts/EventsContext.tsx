import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import {
  BehaviorSubject,
  type Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs';

import {
  type ConfigurationValues,
  DEFAULT_CONFIGURATION_VALUES,
} from '@/tools/grid-maker/Configuration';
import { Papers } from '@/tools/grid-maker/papers';
import { type Inch, type Pixel } from '@/tools/grid-maker/units';

export interface EventsContextValue {
  readonly paperKey$: BehaviorSubject<keyof typeof Papers>;
  readonly cellSize$: BehaviorSubject<Inch>;
  readonly fontSize$: BehaviorSubject<Pixel>;
  readonly configuration$: Observable<ConfigurationValues>;
  readonly renderPaperKey$: BehaviorSubject<keyof typeof Papers>;
  readonly renderCellSize$: BehaviorSubject<Inch>;
  readonly renderFontSize$: BehaviorSubject<Pixel>;
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
  const subjects = useMemo(() => {
    const paperKey$ = new BehaviorSubject<keyof typeof Papers>(
      initialValues?.paperKey ?? DEFAULT_CONFIGURATION_VALUES.paperKey,
    );
    const cellSize$ = new BehaviorSubject<Inch>(
      initialValues?.cellSize ?? DEFAULT_CONFIGURATION_VALUES.cellSize,
    );
    const fontSize$ = new BehaviorSubject<Pixel>(
      initialValues?.fontSize ?? DEFAULT_CONFIGURATION_VALUES.fontSize,
    );

    const configuration$ = combineLatest({
      paperKey: paperKey$,
      cellSize: cellSize$,
      fontSize: fontSize$,
    });

    const renderPaperKey$ = new BehaviorSubject<keyof typeof Papers>(
      paperKey$.getValue(),
    );
    const renderCellSize$ = new BehaviorSubject<Inch>(cellSize$.getValue());
    const renderFontSize$ = new BehaviorSubject<Pixel>(fontSize$.getValue());

    return {
      paperKey$,
      cellSize$,
      fontSize$,
      configuration$,
      renderPaperKey$,
      renderCellSize$,
      renderFontSize$,
    };
  }, []);

  useEffect(() => {
    const subscription = subjects.configuration$
      .pipe(debounceTime(DEBOUNCE_MS), distinctUntilChanged())
      .subscribe((values) => {
        subjects.renderPaperKey$.next(values.paperKey);
        subjects.renderCellSize$.next(values.cellSize);
        subjects.renderFontSize$.next(values.fontSize);
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
