import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import InputField from './InputField';

describe('InputField Accessibility', () => {
  it('should have appropriate accessibility attributes including id', () => {
    const labelText = 'Test Label';
    render(<InputField labelText={labelText} />);

    const input = screen.getByLabelText(labelText);
    const label = screen.getByText(labelText);

    // Check if input has an id
    expect(input).toHaveAttribute('id');
    const inputId = input.getAttribute('id');
    expect(inputId).not.toBeNull();

    // Check if label has an id
    expect(label).toHaveAttribute('id');
    const labelId = label.getAttribute('id');
    expect(labelId).not.toBeNull();

    // Check htmlFor relationship
    expect(label).toHaveAttribute('for', inputId);

    // Check aria-labelledby relationship
    expect(input).toHaveAttribute('aria-labelledby', labelId);
  });

  it('should have aria-describedby when error message is present', () => {
    const labelText = 'Test Label With Error';
    const errorMessage = 'Error occurred';
    render(<InputField labelText={labelText} errorMessage={errorMessage} />);

    const input = screen.getByLabelText(labelText);
    const error = screen.getByText(errorMessage);

    // Check if error message has an id
    expect(error).toHaveAttribute('id');
    const errorId = error.getAttribute('id');
    expect(errorId).not.toBeNull();

    // Check aria-describedby relationship
    expect(input).toHaveAttribute('aria-describedby', errorId);
  });

  it('should not have aria-describedby when error message is missing', () => {
    const labelText = 'Test Label No Error';
    render(<InputField labelText={labelText} />);

    const input = screen.getByLabelText(labelText);

    // aria-describedby should be null or missing
    expect(input).not.toHaveAttribute('aria-describedby');
  });
});
