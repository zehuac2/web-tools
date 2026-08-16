import { type FC, useDeferredValue } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import Grid from './components/Grid';
import Configuration, { type ConfigurationValues } from './Configuration';
import { Papers } from './papers';
import { type Inch, type Pixel, inchToPixel } from './units';

import { css } from 'styled-system/css';
import { card } from 'styled-system/recipes';

const App: FC = () => {
  const form = useForm<ConfigurationValues>({
    mode: 'onChange',
    defaultValues: {
      cellSize: 0.2 as Inch,
      paperKey: 'US_ENVELOPE_9',
      fontSize: 6 as Pixel,
    },
  });
  const { watch } = form;

  const paper = Papers[watch('paperKey')];
  const { width, height } = paper;

  const deferredWidth = useDeferredValue(inchToPixel(width));
  const deferredHeight = useDeferredValue(inchToPixel(height));
  const deferredCellSize = useDeferredValue(inchToPixel(watch('cellSize')));
  const deferredFontSize = useDeferredValue(watch('fontSize'));

  const colCount =
    deferredCellSize > 0 ? Math.floor(deferredWidth / deferredCellSize) : 0;
  const rowCount =
    deferredCellSize > 0 ? Math.floor(deferredHeight / deferredCellSize) : 0;

  return (
    <FormProvider {...form}>
      <div
        className={css({
          display: { base: 'grid', _print: 'block' },
          gap: '6',
          gridTemplateColumns: {
            base: 'auto',
            lg: '[1fr 370px]',
          },
          alignItems: {
            lg: 'stretch',
          },
        })}
      >
        <section className={card()}>
          <div
            className={css({
              px: '5',
              py: '4',
              borderBottomWidth: '[1px]',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border.default',
              display: { _print: 'none' },
            })}
          >
            <div className={css({ fontSize: 'md', fontWeight: 'ui' })}>
              Preview
            </div>
            <div
              className={css({
                fontSize: 'sm',
                color: 'fg.muted',
                mt: '1',
              })}
            >
              {colCount} × {rowCount} grid ({width}" × {height}")
            </div>
          </div>

          <div
            className={css({
              p: { base: '4', _print: '0' },
            })}
          >
            <div
              className={css({
                overflow: { base: 'auto', _print: 'visible' },
                bg: 'white',
                borderWidth: { base: '[1px]', _print: '0' },
                borderStyle: { base: 'solid', _print: 'none' },
                borderColor: 'border.default',
                borderRadius: { base: 'inner', _print: '[0]' },
                p: { base: '4', _print: '0' },
              })}
            >
              <Grid
                className={css({
                  display: 'block',
                  margin: '[0 auto]',
                  bg: 'white',
                  borderWidth: { base: '[1px]', _print: '0' },
                  borderStyle: { base: 'solid', _print: 'none' },
                  borderColor: 'border.strong',
                  boxShadow: { base: 'subtle', _print: '[none]' },
                })}
                width={deferredWidth}
                height={deferredHeight}
                cellSize={deferredCellSize}
                fontSize={deferredFontSize}
                alt={`A grid whose width is ${width} inches, and whose height is ${height} inches`}
              />
            </div>
          </div>
        </section>

        <Configuration
          className={css({
            display: { _print: 'none' },
          })}
          onSubmit={() => {
            window.print();
          }}
        />
      </div>
    </FormProvider>
  );
};

App.displayName = 'App';

export default App;
