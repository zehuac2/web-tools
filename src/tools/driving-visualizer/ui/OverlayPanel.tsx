import { type FC, type ReactNode } from 'react';
import { css, cx } from 'styled-system/css';
import { overlay } from 'styled-system/recipes';
import type { OverlayVariantProps } from 'styled-system/recipes';

export interface OverlayPanelProps {
  className?: string;
  /** Which edge or corner of the canvas the panel pins to. */
  placement: NonNullable<OverlayVariantProps['placement']>;
  title?: string;
  children: ReactNode;
}

const titleClassName = css({
  fontSize: 'ui12',
  fontWeight: 'ui',
  letterSpacing: '[2px]',
  textTransform: 'uppercase',
  color: 'fg.muted',
  mb: '2',
});

/**
 * A translucent panel that floats over the full-bleed canvas. This is the
 * driving visualizer's counterpart to the shared `ToolPanel` card.
 */
const OverlayPanel: FC<OverlayPanelProps> = ({
  className,
  placement,
  title,
  children,
}) => {
  return (
    <div className={cx(overlay({ placement }), className)}>
      {title && <div className={titleClassName}>{title}</div>}
      {children}
    </div>
  );
};

OverlayPanel.displayName = 'OverlayPanel';

export default OverlayPanel;
