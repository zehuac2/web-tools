// Compact controls reference, shown as a card in the settings column.

import { type FC, type ReactNode } from 'react';
import { css } from 'styled-system/css';
import ToolPanel from '@/components/ToolPanel';

const lineClassName = css({
  fontSize: 'ui13',
  color: 'fg.muted',
  lineHeight: '[1.8]',
});

const keyClassName = css({
  display: 'inline-block',
  bg: 'bg.canvas',
  borderWidth: '[1px]',
  borderStyle: 'solid',
  borderColor: 'border.default',
  borderRadius: '[3px]',
  px: '1',
  color: 'fg.default',
  fontFamily: 'mono',
  fontSize: 'ui12',
  mr: '1',
});

function K({ children }: { children: ReactNode }): React.ReactElement {
  return <span className={keyClassName}>{children}</span>;
}

/** Static reference for the driving visualizer's keyboard and mouse controls. */
const Controls: FC = () => {
  return (
    <ToolPanel title="Controls">
      <div className={lineClassName}>
        <K>W</K>
        <K>↑</K> Forward &nbsp; <K>S</K>
        <K>↓</K> Reverse
        <br />
        <K>A</K>
        <K>←</K> Steer Left &nbsp; <K>D</K>
        <K>→</K> Right
        <br />
        (releases auto-center) &nbsp; <K>Space</K> Hold
        <br />
        <K>C</K> Center Steering
        <br />
        <K>Scroll</K> Zoom &nbsp; <K>Drag</K> Pan
      </div>
    </ToolPanel>
  );
};

Controls.displayName = 'Controls';

export default Controls;
