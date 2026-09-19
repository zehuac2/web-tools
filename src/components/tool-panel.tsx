import { type FC, type ReactNode } from 'react';
import { css, cx } from 'styled-system/css';
import { card } from 'styled-system/recipes';

export interface ToolPanelProps {
  className?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

/**
 * A `card()` wrapper with a title and optional subtitle. This is the shared
 * shell for every tool's settings/controls panel.
 */
const ToolPanel: FC<ToolPanelProps> = ({
  className,
  title,
  subtitle,
  children,
}) => {
  return (
    <div className={cx(card(), className)}>
      <div className={css({ fontSize: 'md', fontWeight: 'ui' })}>{title}</div>
      {subtitle && (
        <div className={css({ fontSize: 'sm', color: 'fg.muted', mt: '1' })}>
          {subtitle}
        </div>
      )}
      <div className={css({ mt: '4' })}>{children}</div>
    </div>
  );
};

ToolPanel.displayName = 'ToolPanel';

export default ToolPanel;
