export const REPO_URL = 'https://github.com/zehuac2/web-tools';

export interface ToolMeta {
  readonly slug: string;
  readonly title: string;
  readonly glyph: string;
  readonly blurb: string;
}

export const TOOLS: readonly ToolMeta[] = [
  {
    slug: 'grid-maker',
    title: 'Grid Maker',
    glyph: '▦',
    blurb: 'Create custom printable grids for various paper sizes.',
  },
  {
    slug: 'driving-visualizer',
    title: 'Driving Visualizer',
    glyph: '◈',
    blurb: 'Visualize a car’s swept path through a maneuver, top-down.',
  },
  {
    slug: 'random',
    title: 'Random',
    glyph: '#',
    blurb:
      'Generate random strings from configurable letter and number sections.',
  },
  {
    slug: 'receipt-splitter',
    title: 'Receipt Splitter',
    glyph: '%',
    blurb: 'Split a shared receipt equally, by fees, or proportionally.',
  },
] as const;
