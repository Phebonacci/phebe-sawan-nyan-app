import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './select';

describe('<Select />', () => {
  const mockOptions = [
    {
      name: 'Orange',
      value: 'orange',
    },
    {
      name: 'Mango',
      value: 'mango',
    },
    {
      name: 'Apple',
      value: 'apple',
    },
    {
      name: 'Blueberry',
      value: 'blueberry',
    }
  ];
  it('renders the label and the options', () => {
    const { queryByText } = render(
      <Select
        label='Fruit'
        options={mockOptions}
        onChange={jest.fn()}
      />,
    );
    expect(queryByText('Fruit')).toBeVisible();
    expect(queryByText('Orange')).toBeInTheDocument();
    expect(queryByText('Mango')).toBeInTheDocument();
    expect(queryByText('Apple')).toBeInTheDocument();
    expect(queryByText('Blueberry')).toBeInTheDocument();
  });

  it('renders all the options with the option matching the value prop as the selected option', () => {
    const { queryByText } = render(
      <Select
        options={mockOptions}
        value={'mango'}
        onChange={jest.fn()}
      />,
    );
    expect(queryByText('Orange')).toBeInTheDocument();
    expect(queryByText('Mango')).toBeVisible();
    expect(queryByText('Apple')).toBeInTheDocument();
    expect(queryByText('Blueberry')).toBeInTheDocument();
  });

  it('renders the custom placeholder', () => {
    const placeholder = 'Select a fruit';
    const { queryByText } = render(
      <Select
        options={mockOptions}
        placeholder={placeholder}
        onChange={jest.fn()}
      />,
    );
    expect(queryByText(placeholder)).toBeVisible()
  });

  it('calls the onChange listener when an options is selected', () => {
    const mockOnChangeListener = jest.fn();
    const { getByLabelText } = render(
      <Select
        id='fruit'
        label='Fruit'
        options={mockOptions} onChange={mockOnChangeListener}
      />,
    );
    userEvent.selectOptions(getByLabelText('Fruit'), 'blueberry');
    expect(mockOnChangeListener).toHaveBeenCalledTimes(1);
    expect(mockOnChangeListener).toHaveBeenCalledWith('blueberry');
  });
});
