import React from 'react';
import Alert from 'react-bootstrap/Alert';

interface AlertErrorProps {
  message: string
  onClose: () => void
}

export const AlertError: React.FC<AlertErrorProps> = ({ message, onClose }) => (
  <Alert variant='danger' onClose={onClose} dismissible>
    <Alert.Heading>Yikes!</Alert.Heading>
    <p>
      {message}
    </p>
  </Alert>
)
