import { type FC } from 'react';
import { css } from 'styled-system/css';
import { button } from 'styled-system/recipes';
import ToolPanel from '@/components/ToolPanel';
import {
  useAppDispatch,
  useAppSelector,
} from '@/tools/driving-visualizer/store/index';
import { toggleFillVisible } from '@/tools/driving-visualizer/store/uiSlice';

export interface ToolbarProps {
  onReset: () => void;
  onClearTraces: () => void;
  onCenterSteering: () => void;
  onCenterCamera: () => void;
}

const containerClassName = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
});

/** Action buttons for the driving visualizer: reset, clear, center, toggles. */
const Toolbar: FC<ToolbarProps> = ({
  onReset,
  onClearTraces,
  onCenterSteering,
  onCenterCamera,
}) => {
  const dispatch = useAppDispatch();
  const fillVisible = useAppSelector((state) => state.ui.fillVisible);

  return (
    <ToolPanel title="Actions">
      <div className={containerClassName}>
        <button
          className={button({ variant: 'subtle' })}
          onClick={onReset}
          title="Reset car to origin"
        >
          ↺ Reset Pose
        </button>
        <button
          className={button({ variant: 'subtle' })}
          onClick={onClearTraces}
          title="Clear corner trails"
        >
          ⌫ Clear Traces
        </button>
        <button
          className={button({ variant: 'subtle' })}
          onClick={onCenterSteering}
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
          onClick={onCenterCamera}
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
