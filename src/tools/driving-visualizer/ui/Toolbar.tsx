import { type FC } from 'react';
import { css } from 'styled-system/css';
import { button } from 'styled-system/recipes';
import ToolPanel from '@/components/ToolPanel';
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

const containerClassName = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
});

/** Action buttons for the driving visualizer: reset, clear, center, toggles. */
const Toolbar: FC = () => {
  const dispatch = useAppDispatch();
  const fillVisible = useAppSelector((state) => state.ui.fillVisible);

  return (
    <ToolPanel title="Actions">
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
    </ToolPanel>
  );
};

Toolbar.displayName = 'Toolbar';

export default Toolbar;
