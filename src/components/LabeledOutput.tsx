import { type FC } from 'react';
import { css, cx } from 'styled-system/css';

export interface LabeledOutputProps {
  className?: string;
  label: string;
  value: string;
  highlight?: boolean;
}

const rowClassName = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  py: '2',
});

const labelClassName = css({ fontSize: 'ui14', color: 'fg.muted' });

const LabeledOutput: FC<LabeledOutputProps> = ({
  className,
  label,
  value,
  highlight,
}) => {
  const isPlaceholder = value === '?';

  const valueClassName = css({
    fontSize: highlight ? 'ui20' : 'ui14',
    fontWeight: highlight ? 'ui' : 'normal',
    color: highlight
      ? isPlaceholder
        ? 'fg.muted'
        : 'positive.fg'
      : 'fg.default',
  });

  return (
    <div className={cx(rowClassName, className)}>
      <span className={labelClassName}>{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
};

LabeledOutput.displayName = 'LabeledOutput';

export default LabeledOutput;
