import { AxiosInstance } from 'axios';
import React from 'react';

export const CatApiClientContext = React.createContext<AxiosInstance>(
  ({} as unknown) as AxiosInstance
);
