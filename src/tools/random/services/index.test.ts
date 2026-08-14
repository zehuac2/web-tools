import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createSection,
  updateSection,
  generateSectionString,
  generateOutput,
  type RandomSection,
} from './index';

function makeSection(over: Partial<RandomSection> = {}): RandomSection {
  return { ...createSection(), ...over };
}

describe('createSection', () => {
  it('gives every section a unique id, even created in the same tick', () => {
    const a = createSection();
    const b = createSection();
    expect(a.id).not.toBe(b.id);
  });
});

describe('updateSection', () => {
  it('merges a partial update without touching the id', () => {
    const section = makeSection({ name: 'Prefix' });
    const updated = updateSection(section, { name: 'Suffix', length: 8 });
    expect(updated).toEqual({ ...section, name: 'Suffix', length: 8 });
  });
});

describe('generateSectionString', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('produces a string of the requested length', () => {
    const section = makeSection({ length: 12 });
    expect(generateSectionString(section)).toHaveLength(12);
  });

  it('produces an empty string for length 0', () => {
    const section = makeSection({ length: 0 });
    expect(generateSectionString(section)).toBe('');
  });

  it('only uses digits when useLetters is false', () => {
    const section = makeSection({
      length: 50,
      useLetters: false,
      useNumbers: true,
    });
    expect(generateSectionString(section)).toMatch(/^[0-9]+$/);
  });

  it('only uses letters when useNumbers is false', () => {
    const section = makeSection({
      length: 50,
      useLetters: true,
      useNumbers: false,
    });
    expect(generateSectionString(section)).toMatch(/^[a-z]+$/);
  });

  it('can produce the digit 9 (the last digit is reachable)', () => {
    // Digits are '0123456789', 10 choices. A near-1 random value should map
    // to the last index (9), i.e. the character '9'.
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const section = makeSection({
      length: 1,
      useLetters: false,
      useNumbers: true,
    });
    expect(generateSectionString(section)).toBe('9');
  });

  it('throws when both letters and numbers are disabled', () => {
    const section = makeSection({ useLetters: false, useNumbers: false });
    expect(() => generateSectionString(section)).toThrow(
      'Cannot create random string from empty choices',
    );
  });
});

describe('generateOutput', () => {
  it('joins each section output with a dash', () => {
    const a = makeSection({ length: 3 });
    const b = makeSection({ length: 4 });
    const output = generateOutput([a, b]);
    const [first, second] = output.split('-');
    expect(first).toHaveLength(3);
    expect(second).toHaveLength(4);
  });

  it('returns an empty string for no sections', () => {
    expect(generateOutput([])).toBe('');
  });
});
