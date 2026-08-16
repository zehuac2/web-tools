import { type FC } from 'react';
import { css } from 'styled-system/css';
import ToolPanel from '@/components/ToolPanel';
import type { TelemetryData } from '@/tools/driving-visualizer/store/telemetrySlice';

export interface TelemetryProps {
  data: TelemetryData;
}

const rowClassName = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '4',
  fontSize: 'ui13',
  py: '1',
});

const labelClassName = css({ color: 'fg.muted' });
const valueClassName = css({
  color: 'fg.default',
  fontVariantNumeric: 'tabular-nums',
});

function indicatorClassName(driving: boolean): string {
  return css({
    display: 'inline-block',
    width: '[8px]',
    height: '[8px]',
    borderRadius: '[50%]',
    bg: driving ? 'positive.fg' : 'border.strong',
    mr: '2',
    verticalAlign: 'middle',
  });
}

function fmt(n: number, decimals = 2): string {
  return Number.isFinite(n) ? n.toFixed(decimals) : '∞';
}

/** Read-only live telemetry readout for the driving visualizer. */
const Telemetry: FC<TelemetryProps> = ({ data }) => {
  const { x, y, headingDeg, steeringDeg, turningRadius, speed, driving } = data;

  // Normalize heading to [0, 360).
  const hdg = ((headingDeg % 360) + 360) % 360;

  return (
    <ToolPanel title="Telemetry">
      <div className={rowClassName}>
        <span className={labelClassName}>Status</span>
        <span className={valueClassName}>
          <span className={indicatorClassName(driving)} />
          {driving ? 'Moving' : 'Stopped'}
        </span>
      </div>
      <div className={rowClassName}>
        <span className={labelClassName}>Position</span>
        <span className={valueClassName}>
          ({fmt(x, 1)}, {fmt(y, 1)}) m
        </span>
      </div>
      <div className={rowClassName}>
        <span className={labelClassName}>Heading</span>
        <span className={valueClassName}>{fmt(hdg, 1)}°</span>
      </div>
      <div className={rowClassName}>
        <span className={labelClassName}>Steering</span>
        <span className={valueClassName}>{fmt(steeringDeg, 1)}°</span>
      </div>
      <div className={rowClassName}>
        <span className={labelClassName}>Turn radius</span>
        <span className={valueClassName}>
          {Number.isFinite(turningRadius)
            ? `${fmt(Math.abs(turningRadius), 2)} m`
            : '∞ (straight)'}
        </span>
      </div>
      <div className={rowClassName}>
        <span className={labelClassName}>Speed</span>
        <span className={valueClassName}>{fmt(speed, 1)} m/s</span>
      </div>
    </ToolPanel>
  );
};

Telemetry.displayName = 'Telemetry';

export default Telemetry;
