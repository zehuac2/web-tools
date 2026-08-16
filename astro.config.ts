// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const REACT_COMPILER_CONFIG = {};

// https://astro.build/config
export default defineConfig({
  site: 'https://zehuac2.github.io',
  base: '/web-tools',
  output: 'static',
  vite: {
    build: {
      chunkSizeWarningLimit: 1024,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: (id) => {
                  if (/\/node_modules\/three\//.test(id)) return 'vendor-three';
                },
                minShareCount: 0,
                minSize: 0,
              },
              {
                name: (id) => {
                  if (
                    /\/node_modules\/(@react-three\/|three-stdlib\/)/.test(id)
                  )
                    return 'vendor-r3f';
                },
                minShareCount: 0,
                minSize: 0,
              },
              {
                name: (id) => {
                  if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id))
                    return 'vendor-react';
                },
                minShareCount: 0,
                minSize: 0,
              },
            ],
          },
        },
      },
    },
  },
  integrations: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', REACT_COMPILER_CONFIG]],
      },
    }),
  ],
});
