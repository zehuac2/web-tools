import { type FC, useId, type ComponentPropsWithoutRef } from 'react';

export type InputPropsToOmit =
  'className' | 'id' | 'aria-labelledby' | 'aria-describedby';

interface CellSizeInputProps extends Omit<
  ComponentPropsWithoutRef<'input'>,
  InputPropsToOmit
> {
  labelClassName?: string;
  labelText: string;
  inputClassName?: string;
  errorMessageClassName?: string;
  errorMessage?: string | undefined;
}

const InputField: FC<CellSizeInputProps> = ({
  labelClassName,
  labelText,
  inputClassName,
  errorMessageClassName,
  errorMessage,
  ...props
}) => {
  const labelId = useId();
  const errorMessageId = useId();
  const inputId = useId();

  return (
    <>
      <label id={labelId} className={labelClassName} htmlFor={inputId}>
        {labelText}
      </label>
      <input
        className={inputClassName}
        id={inputId}
        aria-labelledby={labelId}
        aria-describedby={errorMessage && errorMessageId}
        {...props}
      />
      {errorMessage && (
        <p id={errorMessageId} className={errorMessageClassName}>
          {errorMessage}
        </p>
      )}
    </>
  );
};

InputField.displayName = 'InputField';

export default InputField;
