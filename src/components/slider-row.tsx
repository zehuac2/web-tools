import { type FC } from 'react';
import { css } from 'styled-system/css';

export interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  decimals?: number;
  onChange: (value: number) => void;
}

const rowClassName = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2.5',
  fontSize: 'sm',
  color: 'fg.default',
});

const labelClassName = css({
  width: '36',
  color: 'fg.muted',
  textAlign: 'right',
  flexShrink: 0,
});

const sliderClassName = css({
  flexGrow: 1,
  accentColor: 'brand.solid',
  cursor: 'pointer',
});

const valueClassName = css({
  width: '14',
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
  flexShrink: 0,
});

const unitClassName = css({
  width: '8',
  color: 'fg.muted',
  flexShrink: 0,
});

/** A labeled range input with a live value readout. */
const SliderRow: FC<SliderRowProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  decimals = 2,
  onChange,
}) => {
  return (
    <div className={rowClassName}>
      <span className={labelClassName}>{label}</span>
      <input
        type="range"
        className={sliderClassName}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(parseFloat(event.target.value))}
        aria-label={label}
      />
      <span className={valueClassName}>{value.toFixed(decimals)}</span>
      <span className={unitClassName}>{unit}</span>
    </div>
  );
};

SliderRow.displayName = 'SliderRow';

export default SliderRow;
