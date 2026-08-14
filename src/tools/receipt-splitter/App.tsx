import { type FC, useState } from 'react';
import { css } from 'styled-system/css';
import { button, control } from 'styled-system/recipes';
import InputField from '@/components/InputField';
import ToolPanel from '@/components/ToolPanel';
import LabeledOutput from '@/components/LabeledOutput';
import {
  formatCurrency,
  splitEqual,
  splitEqualFees,
  splitProportional,
  type Strategy,
} from './split';

interface StrategyOption {
  key: Strategy;
  label: string;
}

const STRATEGIES: StrategyOption[] = [
  { key: 'equal', label: 'Equally' },
  { key: 'equalFees', label: 'Fees Equally' },
  { key: 'proportional', label: 'Proportionally' },
];

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
const fieldsClassName = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3',
  mt: '4',
});
const selectorClassName = css({ display: 'flex', gap: '2', flexWrap: 'wrap' });

const App: FC = () => {
  const [strategy, setStrategy] = useState<Strategy>('equal');
  const [yourSubtotal, setYourSubtotal] = useState('');
  const [orderSubtotal, setOrderSubtotal] = useState('');
  const [orderTotal, setOrderTotal] = useState('');
  const [people, setPeople] = useState('');

  const parsedYourSubtotal = parseFloat(yourSubtotal);
  const parsedOrderSubtotal = parseFloat(orderSubtotal);
  const parsedOrderTotal = parseFloat(orderTotal);
  const parsedPeople = parseFloat(people);

  const equal = splitEqual({
    orderTotal: parsedOrderTotal,
    people: parsedPeople,
  });
  const equalFees = splitEqualFees({
    yourSubtotal: parsedYourSubtotal,
    orderSubtotal: parsedOrderSubtotal,
    orderTotal: parsedOrderTotal,
    people: parsedPeople,
  });
  const proportional = splitProportional({
    yourSubtotal: parsedYourSubtotal,
    orderSubtotal: parsedOrderSubtotal,
    orderTotal: parsedOrderTotal,
  });

  const amount =
    strategy === 'equal'
      ? equal.amount
      : strategy === 'equalFees'
        ? equalFees.amount
        : proportional.amount;

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
        <ToolPanel title="Your Payment">
          <LabeledOutput
            label="You Pay"
            highlight
            value={amount !== null ? formatCurrency(amount) : '?'}
          />
        </ToolPanel>

        {strategy === 'equalFees' && (
          <ToolPanel title="Calculation Breakdown">
            <LabeledOutput
              label="Fees and Tips"
              value={
                equalFees.feesAndTips !== null
                  ? formatCurrency(equalFees.feesAndTips)
                  : '?'
              }
            />
            <LabeledOutput
              label="Fees per Person"
              value={
                equalFees.feesPerPerson !== null
                  ? formatCurrency(equalFees.feesPerPerson)
                  : '?'
              }
            />
          </ToolPanel>
        )}

        {strategy === 'proportional' && (
          <ToolPanel title="Calculation Breakdown">
            <LabeledOutput
              label="Your Percentage"
              value={
                proportional.percentage !== null
                  ? `${proportional.percentage.toFixed(2)}%`
                  : '?'
              }
            />
            <LabeledOutput
              label="Fees and Tips"
              value={
                proportional.feesAndTips !== null
                  ? formatCurrency(proportional.feesAndTips)
                  : '?'
              }
            />
            <LabeledOutput
              label="Your Share of Fees and Tips"
              value={
                proportional.yourShareOfFeesAndTips !== null
                  ? formatCurrency(proportional.yourShareOfFeesAndTips)
                  : '?'
              }
            />
          </ToolPanel>
        )}
      </div>

      <ToolPanel title="Receipt" subtitle="Split a shared receipt">
        <div
          role="radiogroup"
          aria-label="Split strategy"
          className={selectorClassName}
        >
          {STRATEGIES.map((option) => (
            <button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={strategy === option.key}
              className={button({
                variant: 'subtle',
                pressed: strategy === option.key,
              })}
              onClick={() => setStrategy(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className={fieldsClassName}>
          {strategy !== 'equal' && (
            <div className={fieldClassName}>
              <InputField
                labelClassName={labelClassName}
                labelText="Your sub total"
                inputClassName={control()}
                inputMode="decimal"
                placeholder="0.00"
                value={yourSubtotal}
                onChange={(event) => setYourSubtotal(event.target.value)}
              />
            </div>
          )}

          {strategy !== 'equal' && (
            <div className={fieldClassName}>
              <InputField
                labelClassName={labelClassName}
                labelText="Order sub total"
                inputClassName={control()}
                inputMode="decimal"
                placeholder="0.00"
                value={orderSubtotal}
                onChange={(event) => setOrderSubtotal(event.target.value)}
              />
            </div>
          )}

          <div className={fieldClassName}>
            <InputField
              labelClassName={labelClassName}
              labelText="Order total"
              inputClassName={control()}
              inputMode="decimal"
              placeholder="0.00"
              value={orderTotal}
              onChange={(event) => setOrderTotal(event.target.value)}
            />
          </div>

          {strategy !== 'proportional' && (
            <div className={fieldClassName}>
              <InputField
                labelClassName={labelClassName}
                labelText="Split between people"
                inputClassName={control()}
                inputMode="numeric"
                placeholder="1"
                value={people}
                onChange={(event) => setPeople(event.target.value)}
              />
            </div>
          )}
        </div>
      </ToolPanel>
    </div>
  );
};

App.displayName = 'App';

export default App;
