// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const REACT_COMPILER_CONFIG = {};

// https://astro.build/config
export default defineConfig({
  site: 'https://zehuac2.github.io',
  base: '/web-tools',
  output: 'static',
  integrations: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', REACT_COMPILER_CONFIG]],
      },
    }),
  ],
});
