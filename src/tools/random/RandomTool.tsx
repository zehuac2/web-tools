import { type FC } from 'react';
import { css } from 'styled-system/css';
import { button, panel } from 'styled-system/recipes';
import ToolPanel from '@/components/ToolPanel';
import RandomSection from './components/RandomSection';
import {
  addSection,
  deleteSection,
  generate,
  updateSection,
} from './store/randomSlice';
import { useAppDispatch, useAppSelector } from './store';

export interface RandomToolProps {}

const RandomTool: FC<RandomToolProps> = () => {
  const dispatch = useAppDispatch();
  const output = useAppSelector((state) => state.random.output);
  const sections = useAppSelector((state) => state.random.sections);

  return (
    <div
      className={css({
        display: 'grid',
        gap: '6',
        gridTemplateColumns: {
          base: 'auto',
          lg: '[1fr 370px]',
        },
        alignItems: { lg: 'start' },
      })}
    >
      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
      >
        {sections.length === 0 && (
          <div className={panel()}>Add a section to get started.</div>
        )}
        {sections.map((section, index) => (
          <RandomSection
            key={section.id}
            value={section}
            onChange={(next) =>
              dispatch(updateSection({ index, section: next }))
            }
            onDelete={() => dispatch(deleteSection(index))}
          />
        ))}
      </div>

      <ToolPanel
        title="Output"
        subtitle="Generate a random string from your sections"
      >
        <div
          aria-label="output"
          className={css({
            fontSize: 'md',
            fontWeight: 'ui',
            wordBreak: 'break-all',
            mb: '4',
          })}
        >
          {output}
        </div>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '2',
          })}
        >
          <button className={button()} onClick={() => dispatch(generate())}>
            Generate
          </button>
          <button
            className={button({ variant: 'subtle' })}
            onClick={() => dispatch(addSection())}
          >
            Add Section
          </button>
        </div>
      </ToolPanel>
    </div>
  );
};

RandomTool.displayName = 'RandomTool';

export default RandomTool;
