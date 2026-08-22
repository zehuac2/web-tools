import { type FC } from 'react';
import { css } from 'styled-system/css';

import useBehaviorSubject from '@/hooks/react/useBehaviorSubject';
import { useEvents } from '@/tools/grid-maker/contexts/EventsContext';
import { calculateGridDimensions } from './Grid';

export interface PreviewHeaderProps {
  className?: string;
}

const PreviewHeader: FC<PreviewHeaderProps> = ({ className }) => {
  const { paperKey$, cellSize$ } = useEvents();

  const paperKey = useBehaviorSubject(paperKey$);
  const cellSize = useBehaviorSubject(cellSize$);

  const { width, height, colCount, rowCount } = calculateGridDimensions(
    paperKey,
    cellSize,
  );

  return (
    <div className={className}>
      <div className={css({ fontSize: 'md', fontWeight: 'ui' })}>Preview</div>
      <div
        className={css({
          fontSize: 'sm',
          color: 'fg.muted',
          mt: '1',
        })}
      >
        {colCount} × {rowCount} grid ({width}" × {height}")
      </div>
    </div>
  );
};

PreviewHeader.displayName = 'PreviewHeader';

export default PreviewHeader;
