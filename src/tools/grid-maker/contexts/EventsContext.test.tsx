import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useEffect } from 'react';

import useBehaviorSubject from '@/hooks/react/useBehaviorSubject';
import {
  EventsProvider,
  useEvents,
  type EventsContextValue,
} from './EventsContext';
import { type ConfigurationValues } from '@/tools/grid-maker/configurationValues';
import { type Inch, type Pixel } from '@/tools/grid-maker/units';

const DEBOUNCE_MS = 300;

/**
 * Mount an `EventsProvider` and return the subjects it owns.
 */
function renderEvents(): EventsContextValue {
  let events: EventsContextValue | null = null;

  function Probe() {
    events = useEvents();
    return null;
  }

  render(
    <EventsProvider>
      <Probe />
    </EventsProvider>,
  );

  if (!events) {
    throw new Error('EventsProvider did not render');
  }

  return events;
}

describe('EventsContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Spreads debounced values to render subjects', () => {
    const DEFAULT_VALUES: ConfigurationValues = {
      paperKey: 'US_ENVELOPE_9',
      cellSize: 0.2 as Inch,
      fontSize: 6 as Pixel,
    };

    function TestComponent() {
      const {
        paperKey$,
        cellSize$,
        fontSize$,
        renderPaperKey$,
        renderCellSize$,
        renderFontSize$,
      } = useEvents();

      const renderPaperKey = useBehaviorSubject(renderPaperKey$);
      const renderCellSize = useBehaviorSubject(renderCellSize$);
      const renderFontSize = useBehaviorSubject(renderFontSize$);

      useEffect(() => {
        paperKey$.next('US_LETTER');
        cellSize$.next(0.5 as Inch);
        fontSize$.next(12 as Pixel);
      }, [paperKey$, cellSize$, fontSize$]);

      return (
        <div>
          <span data-testid="renderPaperKey">{renderPaperKey}</span>
          <span data-testid="renderCellSize">{renderCellSize}</span>
          <span data-testid="renderFontSize">{renderFontSize}</span>
        </div>
      );
    }

    const { rerender } = render(
      <EventsProvider initialValues={DEFAULT_VALUES}>
        <TestComponent />
      </EventsProvider>,
    );

    expect(screen.getByTestId('renderPaperKey').textContent).to.equal(
      'US_ENVELOPE_9',
    );
    expect(screen.getByTestId('renderCellSize').textContent).to.equal('0.2');
    expect(screen.getByTestId('renderFontSize').textContent).to.equal('6');

    // Force a re-render so the microtask queue is flushed and timers can
    // advance consistently.
    rerender(
      <EventsProvider initialValues={DEFAULT_VALUES}>
        <TestComponent />
      </EventsProvider>,
    );

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByTestId('renderPaperKey').textContent).to.equal(
      'US_LETTER',
    );
    expect(screen.getByTestId('renderCellSize').textContent).to.equal('0.5');
    expect(screen.getByTestId('renderFontSize').textContent).to.equal('12');
  });

  it('Settled configuration ignores an unchanged emission', () => {
    const events = renderEvents();
    const values: ConfigurationValues[] = [];
    const subscription = events.settledConfiguration$.subscribe((value) =>
      values.push(value),
    );

    act(() => {
      events.cellSize$.next(0.5 as Inch);
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(values).to.have.length(1);

    act(() => {
      events.cellSize$.next(0.5 as Inch);
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(values).to.have.length(1);
    subscription.unsubscribe();
  });

  it('Print waits for the configuration to settle', () => {
    const events = renderEvents();
    const printed: ConfigurationValues[] = [];
    const subscription = events.printConfiguration$.subscribe((value) =>
      printed.push(value),
    );

    act(() => {
      events.cellSize$.next(0.5 as Inch);
      events.print$.next();
    });

    expect(printed).to.have.length(0);

    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_MS);
    });

    expect(printed).to.have.length(1);
    expect(printed[0].cellSize).to.equal(0.5);
    // The render subjects are flushed before the print request emits.
    expect(events.renderCellSize$.getValue()).to.equal(0.5);
    subscription.unsubscribe();
  });
});
