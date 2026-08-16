import { type FC } from 'react';
import { css } from 'styled-system/css';
import { button } from 'styled-system/recipes';
import OverlayPanel from './OverlayPanel';
import {
  useAppDispatch,
  useAppSelector,
} from '@/tools/driving-visualizer/store/index';
import { toggleFillVisible } from '@/tools/driving-visualizer/store/uiSlice';
import {
  centerCamera,
  centerSteering,
  clearTraces,
  resetPose,
} from '@/tools/driving-visualizer/store/sceneActions';

// Below `lg` the buttons wrap into rows. A column would be ~340px tall and
// swallow the canvas on a short viewport.
const containerClassName = css({
  display: 'flex',
  flexDirection: { base: 'row', lg: 'column' },
  flexWrap: 'wrap',
  gap: '2',
});

// While wrapping, stop the panel short of the Telemetry readout in the opposite
// corner: the telemetry floor width, its spacing.3 inset, and a spacing.6 gap.
const panelClassName = css({
  maxWidth: {
    base: '[calc(100vw - token(sizes.telemetry) - token(spacing.3) - token(spacing.6))]',
    lg: '[none]',
  },
});

/** Action buttons for the driving visualizer: reset, clear, center, toggles. */
const Toolbar: FC = () => {
  const dispatch = useAppDispatch();
  const fillVisible = useAppSelector((state) => state.ui.fillVisible);

  return (
    <OverlayPanel
      className={panelClassName}
      placement="topLeft"
      title="Actions"
    >
      <div className={containerClassName}>
        <button
          className={button({ variant: 'subtle' })}
          onClick={() => dispatch(resetPose())}
          title="Reset car to origin"
        >
          ↺ Reset Pose
        </button>
        <button
          className={button({ variant: 'subtle' })}
          onClick={() => dispatch(clearTraces())}
          title="Clear corner trails"
        >
          ⌫ Clear Traces
        </button>
        <button
          className={button({ variant: 'subtle' })}
          onClick={() => dispatch(centerSteering())}
          title="Recenter steering (also: C key)"
        >
          ⟵ Center Steering
        </button>
        <button
          className={button({ variant: 'subtle', pressed: fillVisible })}
          onClick={() => dispatch(toggleFillVisible())}
          title="Toggle swept area fill"
        >
          ◈ {fillVisible ? 'Hide Fill' : 'Show Fill'}
        </button>
        <button
          className={button({ variant: 'subtle' })}
          onClick={() => dispatch(centerCamera())}
          title="Jump camera to car"
        >
          ⊙ Follow Car
        </button>
      </div>
    </OverlayPanel>
  );
};

Toolbar.displayName = 'Toolbar';

export default Toolbar;
