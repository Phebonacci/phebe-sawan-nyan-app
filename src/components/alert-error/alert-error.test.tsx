import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AlertError } from './alert-error';

describe('<AlertError />', () => {
  const message = 'Something wen haywire.';
  it('renders the error message', () => {
    const { queryByText } = render(
      <AlertError message={message} onClose={jest.fn()} />
    );
    expect(queryByText(message)).toBeVisible();
  });

  it('invokes the onClose listener prop on dismiss', () => {
    const mockOnCloseListener = jest.fn();
    const { getByRole } = render(
      <AlertError message={message} onClose={mockOnCloseListener} />
    );
    userEvent.click(getByRole('button'));
    expect(mockOnCloseListener).toHaveBeenCalledTimes(1);
  });
});
