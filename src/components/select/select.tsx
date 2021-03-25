import React from 'react'
import Form from 'react-bootstrap/Form';

export interface SelectOption {
  name: string
  value: string
}

interface SelectProps {
  options: SelectOption[]
  id?: string
  name?: string
  value?: string
  label?: string
  disabled?: boolean
  placeholder?: string
  onChange: (value: string) => void
}

export const Select: React.FC<SelectProps> = ({
  options,
  id,
  name,
  value,
  label,
  disabled,
  placeholder = 'Select an option',
  onChange,
}) => {
  const handleOnChange = (event: React.ChangeEvent<{
    value: string
  }>) => {
    onChange(event.target.value)
  };

  return (
    <Form.Group controlId={id}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        name={name}
        as="select"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={handleOnChange}
      >
        <option value=''>{placeholder}</option>
        {
          options.map((option) => (
            <option key={option.value} value={option.value}>{option.name}</option>
          ))
        }
      </Form.Control>
    </Form.Group>
  )
};
