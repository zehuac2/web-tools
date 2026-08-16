import { type FC } from 'react';
import { css } from 'styled-system/css';
import { useAppSelector } from '@/tools/driving-visualizer/store/index';
import OverlayPanel from './OverlayPanel';

// Hold a floor width so the rows do not reflow as the values change.
const panelClassName = css({ minWidth: '[200px]' });

const rowClassName = css({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '4',
  fontSize: 'sm',
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
const Telemetry: FC = () => {
  const { x, y, headingDeg, steeringDeg, turningRadius, speed, driving } =
    useAppSelector((state) => state.telemetry);

  // Normalize heading to [0, 360).
  const hdg = ((headingDeg % 360) + 360) % 360;

  return (
    <OverlayPanel
      className={panelClassName}
      placement="topRight"
      title="Telemetry"
    >
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
    </OverlayPanel>
  );
};

Telemetry.displayName = 'Telemetry';

export default Telemetry;
