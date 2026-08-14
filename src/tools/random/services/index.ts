const letters = 'abcdefghijklmnopqrstuvwxyz';
const digits = '0123456789';

// Monotonic counter for section ids. `Date.now()` collides when two sections
// are added in the same millisecond; a counter never does.
let nextSectionId = 0;

export type RandomSection = {
  id: number;
  name: string;
  length: number;
  useNumbers: boolean;
  useLetters: boolean;
};

export function createSection(): RandomSection {
  return {
    id: nextSectionId++,
    name: 'New Section',
    length: 5,
    useNumbers: true,
    useLetters: true,
  };
}

export function updateSection(
  section: RandomSection,
  partial: Partial<Omit<RandomSection, 'id'>>,
): RandomSection {
  return { ...section, ...partial };
}

export function generateSectionString(section: RandomSection): string {
  const choices: string[] = [];
  const output: string[] = [];

  if (section.useLetters) {
    for (let i = 0; i < letters.length; i++) {
      choices.push(letters[i]!);
    }
  }

  if (section.useNumbers) {
    for (let i = 0; i < digits.length; i++) {
      choices.push(digits[i]!);
    }
  }

  if (choices.length === 0) {
    throw new Error('Cannot create random string from empty choices');
  }

  for (let i = 0; i < section.length; i++) {
    const index = Math.floor(Math.random() * choices.length);
    output.push(choices[index]!);
  }

  return output.join('');
}

export function generateOutput(sections: readonly RandomSection[]): string {
  return sections.map((section) => generateSectionString(section)).join('-');
}
