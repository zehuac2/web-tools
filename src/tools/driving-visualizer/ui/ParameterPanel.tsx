import { type FC, useState } from 'react';
import { css, cx } from 'styled-system/css';
import { button } from 'styled-system/recipes';
import SliderRow from '@/components/SliderRow';
import OverlayPanel from './OverlayPanel';
import {
  useAppDispatch,
  useAppSelector,
} from '@/tools/driving-visualizer/store/index';
import {
  setWheelbase,
  setFrontOverhang,
  setRearOverhang,
  setBodyWidth,
  setMaxSteeringAngle,
  setSteeringRate,
  setSpeed,
} from '@/tools/driving-visualizer/store/carParamsSlice';

const listClassName = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
});

const toggleClassName = css({ mb: '2' });

// Panda's `lg` breakpoint, in pixels.
const LG_BREAKPOINT = 1024;

/**
 * Report whether the viewport is at least as wide as Panda's `lg` breakpoint.
 * The tool only mounts on the client, so `window` is always available here.
 */
function isWideViewport(): boolean {
  return window.innerWidth >= LG_BREAKPOINT;
}

/** Sliders for every `CarParams` field. Collapsible to save vertical space. */
const ParameterPanel: FC = () => {
  // Seven sliders cover most of a short viewport. Start collapsed there and
  // let the reader open them, but stay open where there is room.
  const [open, setOpen] = useState(isWideViewport);
  const dispatch = useAppDispatch();
  const params = useAppSelector((state) => state.carParams);

  const steerDeg = (params.maxSteeringAngle * 180) / Math.PI;
  const steerRateDeg = (params.steeringRate * 180) / Math.PI;

  return (
    <OverlayPanel placement="bottomCenter" title="Car Parameters">
      <button
        className={cx(button({ variant: 'ghost' }), toggleClassName)}
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        {open ? 'Hide sliders' : 'Show sliders'}
      </button>
      {open && (
        <div className={listClassName}>
          <SliderRow
            label="Wheelbase"
            value={params.wheelbase}
            min={1.5}
            max={6.0}
            step={0.05}
            unit="m"
            onChange={(v) => dispatch(setWheelbase(v))}
          />
          <SliderRow
            label="Front Overhang"
            value={params.frontOverhang}
            min={0.1}
            max={2.0}
            step={0.05}
            unit="m"
            onChange={(v) => dispatch(setFrontOverhang(v))}
          />
          <SliderRow
            label="Rear Overhang"
            value={params.rearOverhang}
            min={0.1}
            max={2.0}
            step={0.05}
            unit="m"
            onChange={(v) => dispatch(setRearOverhang(v))}
          />
          <SliderRow
            label="Body Width"
            value={params.bodyWidth}
            min={1.0}
            max={3.0}
            step={0.05}
            unit="m"
            onChange={(v) => dispatch(setBodyWidth(v))}
          />
          <SliderRow
            label="Max Steering Angle"
            value={steerDeg}
            min={5}
            max={55}
            step={1}
            unit="°"
            decimals={0}
            onChange={(v) => dispatch(setMaxSteeringAngle((v * Math.PI) / 180))}
          />
          <SliderRow
            label="Steering Rate"
            value={steerRateDeg}
            min={10}
            max={180}
            step={5}
            unit="°/s"
            decimals={0}
            onChange={(v) => dispatch(setSteeringRate((v * Math.PI) / 180))}
          />
          <SliderRow
            label="Speed"
            value={params.speed}
            min={0.5}
            max={20}
            step={0.5}
            unit="m/s"
            onChange={(v) => dispatch(setSpeed(v))}
          />
        </div>
      )}
    </OverlayPanel>
  );
};

ParameterPanel.displayName = 'ParameterPanel';

export default ParameterPanel;
