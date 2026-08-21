import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { BehaviorSubject } from 'rxjs';

import useBehaviorSubject from './useBehaviorSubject';

describe('useBehaviorSubject', () => {
  it('Initial value can be received', () => {
    const subject$ = new BehaviorSubject(1);
    const result = renderHook(() => useBehaviorSubject(subject$));

    expect(result.result.current).to.equal(1);
  });

  it('Changes can be received', () => {
    const subject$ = new BehaviorSubject(1);
    const result = renderHook(() => useBehaviorSubject(subject$));

    act(() => {
      subject$.next(10);
    });

    expect(result.result.current).to.equal(10);
  });

  it('Subject is unsubscribed on unmount', () => {
    const subject$ = new BehaviorSubject(1);
    const result = renderHook(() => useBehaviorSubject(subject$));
    result.unmount();

    expect(subject$.observed).to.equal(false);
  });

  it('Swapping to a new subject re-subscribes', () => {
    const subjectA$ = new BehaviorSubject(1);
    const subjectB$ = new BehaviorSubject(100);
    const result = renderHook(({ subject }) => useBehaviorSubject(subject), {
      initialProps: { subject: subjectA$ },
    });

    result.rerender({ subject: subjectB$ });

    expect(result.result.current).to.equal(100);
    expect(subjectA$.observed).to.equal(false);

    act(() => {
      subjectB$.next(200);
    });

    expect(result.result.current).to.equal(200);
  });
});
