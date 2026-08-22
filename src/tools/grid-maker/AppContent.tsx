import { type FC, useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import Grid from './components/Grid';
import PreviewHeader from './components/PreviewHeader';
import Configuration from './Configuration';
import {
  DEFAULT_CONFIGURATION_VALUES,
  type ConfigurationValues,
} from './configurationValues';
import { useEvents } from './contexts/EventsContext';

import { css } from 'styled-system/css';
import { card } from 'styled-system/recipes';

const AppContent: FC = () => {
  const form = useForm<ConfigurationValues>({
    mode: 'onChange',
    defaultValues: DEFAULT_CONFIGURATION_VALUES,
  });
  const { onPrint$, printConfiguration$ } = useEvents();

  // The print dialog opens only after the configuration settles, so the grid
  // in the document matches the values in the form.
  useEffect(() => {
    const subscription = printConfiguration$.subscribe(() => {
      window.print();
    });

    return () => subscription.unsubscribe();
  }, [printConfiguration$]);

  return (
    <FormProvider {...form}>
      <div
        className={css({
          display: { base: 'grid', _print: 'block' },
          gap: '6',
          gridTemplateColumns: {
            base: 'auto',
            lg: '[1fr token(sizes.sidebar)]',
          },
          alignItems: {
            lg: 'stretch',
          },
        })}
      >
        <section className={card()}>
          <PreviewHeader
            className={css({
              px: '5',
              py: '4',
              borderBottom: 'subtle',
              display: { _print: 'none' },
            })}
          />

          <div
            className={css({
              p: { base: '4', _print: '0' },
            })}
          >
            <div
              className={css({
                overflow: { base: 'auto', _print: 'visible' },
                bg: 'white',
                border: { base: 'subtle', _print: 'none' },
                borderRadius: { base: 'inner', _print: '[0]' },
                p: { base: '4', _print: '0' },
              })}
            >
              <Grid
                className={css({
                  display: 'block',
                  margin: '[0 auto]',
                  bg: 'white',
                  border: { base: 'strong', _print: 'none' },
                  boxShadow: { base: 'subtle', _print: '[none]' },
                })}
              />
            </div>
          </div>
        </section>

        <Configuration
          className={css({
            display: { _print: 'none' },
          })}
          onSubmit={() => {
            onPrint$.next();
          }}
        />
      </div>
    </FormProvider>
  );
};

AppContent.displayName = 'AppContent';

export default AppContent;
