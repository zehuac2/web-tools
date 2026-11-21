import { type FC } from 'react';
import { css } from 'styled-system/css';

import { useAppSelector } from '@/tools/grid-maker/store';
import { calculateGridDimensions } from './grid';

export interface PreviewHeaderProps {
  className?: string;
}

const PreviewHeader: FC<PreviewHeaderProps> = ({ className }) => {
  const { paperKey, cellSize } = useAppSelector(
    (state) => state.gridMaker.settled,
  );

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
