import { type FC } from 'react';
import { css, cx } from 'styled-system/css';
import { button, card, control } from 'styled-system/recipes';
import InputField from '@/components/InputField';
import {
  updateSection,
  type RandomSection as RandomSectionValue,
} from '../services';

export interface RandomSectionProps {
  className?: string;
  value: RandomSectionValue;
  onChange: (next: RandomSectionValue) => void;
  onDelete: () => void;
}

const fieldClassName = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
});
const labelClassName = css({
  fontSize: 'ui13',
  fontWeight: 'semibold',
  color: 'fg.default',
});
const choicesLabelClassName = cx(labelClassName, css({ mb: '1' }));
const checkboxRowClassName = css({
  display: 'flex',
  alignItems: 'center',
  gap: '2',
});
const checkboxLabelClassName = css({ fontSize: 'ui14', color: 'fg.default' });

/** One configurable section of the generated random string. */
const RandomSection: FC<RandomSectionProps> = ({
  className,
  value,
  onChange,
  onDelete,
}) => {
  function update(partial: Partial<Omit<RandomSectionValue, 'id'>>): void {
    onChange(updateSection(value, partial));
  }

  return (
    <div className={cx(card(), className)}>
      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
      >
        <div className={fieldClassName}>
          <InputField
            labelClassName={labelClassName}
            labelText="Name"
            inputClassName={control()}
            value={value.name}
            onChange={(event) => update({ name: event.target.value })}
          />
        </div>

        <div className={fieldClassName}>
          <InputField
            labelClassName={labelClassName}
            labelText="Length"
            inputClassName={control()}
            type="number"
            min={0}
            value={value.length}
            onChange={(event) =>
              update({ length: Number(event.target.value) || 0 })
            }
          />
        </div>

        <div className={fieldClassName}>
          <span className={choicesLabelClassName}>Choices</span>
          <label className={checkboxRowClassName}>
            <input
              type="checkbox"
              checked={value.useNumbers}
              onChange={(event) => update({ useNumbers: event.target.checked })}
            />
            <span className={checkboxLabelClassName}>Numbers</span>
          </label>
          <label className={checkboxRowClassName}>
            <input
              type="checkbox"
              checked={value.useLetters}
              onChange={(event) => update({ useLetters: event.target.checked })}
            />
            <span className={checkboxLabelClassName}>Letters</span>
          </label>
        </div>

        <button
          type="button"
          className={button({ variant: 'subtle' })}
          onClick={onDelete}
        >
          Delete Section
        </button>
      </div>
    </div>
  );
};

RandomSection.displayName = 'RandomSection';

export default RandomSection;
