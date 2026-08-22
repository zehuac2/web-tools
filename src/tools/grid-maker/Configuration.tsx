import { type ChangeEvent, type FC, useId } from 'react';

import { useFormContext } from 'react-hook-form';
import InputField from '@/components/InputField';
import { type ConfigurationValues } from './configurationValues';
import { useEvents } from './contexts/EventsContext';
import { Papers } from './papers';
import { type Inch, type Pixel, isValidPixel } from './units';
import { REPO_URL } from '@/meta';

import { css, cx } from 'styled-system/css';
import { button, card, control, panel } from 'styled-system/recipes';

export interface ConfigurationProps {
  className?: string;
  onSubmit: (values: ConfigurationValues) => void;
}

function validateNotInfinite(value: number): boolean {
  return value !== Infinity && value !== -Infinity;
}

function validateInch(inch: number): boolean {
  return isValidPixel(inch as Inch) && validateNotInfinite(inch);
}

function validatePixel(pixel: number): boolean {
  return !isNaN(pixel) && validateNotInfinite(pixel);
}

const Configuration: FC<ConfigurationProps> = ({ className, onSubmit }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useFormContext<ConfigurationValues>();
  const { onPaperKeyChange$, onCellSizeChange$, onFontSizeChange$ } =
    useEvents();
  const paperSizeId = useId();

  const controlClassName = control();

  const labelClassName = css({
    textAlign: { base: 'left', sm: 'right' },
    gridColumn: 1,
    fontSize: 'sm',
    fontWeight: 'semibold',
    color: 'fg.default',
  });

  const errorMessageClassName = css({
    gridColumn: { base: 1, sm: 2 },
    color: 'danger.fg',
    margin: '0',
    fontSize: 'xs',
  });

  return (
    <div className={cx(card(), className)}>
      <div className={css({ fontSize: 'md', fontWeight: 'ui' })}>Settings</div>
      <div
        className={css({
          fontSize: 'sm',
          color: 'fg.muted',
          mt: '1',
        })}
      >
        Customize your grid
      </div>

      <form
        className={css({
          mt: '4',
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'token(sizes.36) 1fr' },
          alignItems: 'center',
          gap: { base: '2.5', sm: '3' },
        })}
        onSubmit={handleSubmit(onSubmit)}
      >
        <label className={labelClassName} htmlFor={paperSizeId}>
          Paper Size
        </label>
        <select
          id={paperSizeId}
          className={controlClassName}
          {...register('paperKey', {
            onChange: (event: ChangeEvent<HTMLSelectElement>) => {
              onPaperKeyChange$.next(event.target.value as keyof typeof Papers);
            },
          })}
        >
          {(Object.keys(Papers) as (keyof typeof Papers)[]).map((paper) => (
            <option key={paper} value={paper}>
              {Papers[paper].displayName}
            </option>
          ))}
        </select>

        <InputField
          labelClassName={labelClassName}
          labelText="Cell Size (inch)"
          inputClassName={controlClassName}
          errorMessageClassName={errorMessageClassName}
          errorMessage={errors.cellSize?.message}
          type="number"
          step={0.1}
          {...register('cellSize', {
            valueAsNumber: true,
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
              onCellSizeChange$.next(event.target.valueAsNumber as Inch);
            },
            validate: validateInch,
            required: 'Cell size is required',
            min: {
              value: 0.1,
              message: 'Cell size must be greater than 0.1 inch',
            },
          })}
        />

        <InputField
          labelClassName={labelClassName}
          labelText="Font Size (px)"
          inputClassName={controlClassName}
          errorMessageClassName={errorMessageClassName}
          errorMessage={errors.fontSize?.message}
          type="number"
          step={1}
          {...register('fontSize', {
            valueAsNumber: true,
            onChange: (event: ChangeEvent<HTMLInputElement>) => {
              onFontSizeChange$.next(event.target.valueAsNumber as Pixel);
            },
            validate: validatePixel,
            required: 'Font size is required',
            min: {
              value: 1,
              message: 'Font size must be at least 1',
            },
          })}
        />

        <button
          className={cx(button(), css({ gridColumn: '1 / -1', mt: '1' }))}
          type="submit"
        >
          Print Grid
        </button>
      </form>

      <div className={cx(panel(), css({ mt: '4' }))}>
        Create custom printable grids for various paper sizes.
        <div className={css({ mt: '2' })}>
          <a
            className={css({
              fontWeight: 'semibold',
              textDecoration: { base: 'none', _hover: 'underline' },
              color: { base: 'fg.default', _hover: 'fg.hover' },
            })}
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

Configuration.displayName = 'Configuration';

export default Configuration;
