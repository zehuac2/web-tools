import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useEffect } from 'react';

import useBehaviorSubject from '@/hooks/react/useBehaviorSubject';
import { EventsProvider, useEvents } from './EventsContext';
import { type ConfigurationValues } from '../Configuration';
import { type Inch, type Pixel } from '../units';

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
});
