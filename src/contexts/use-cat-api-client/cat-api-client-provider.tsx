import axios, { AxiosInstance } from 'axios';
import React from 'react';
import { CatApiClientContext } from './cat-api-client-context';

export const CatApiClientContextProvider: React.FC = ({ children }) => {
  const instance: AxiosInstance = axios.create({
    baseURL: 'https://api.thecatapi.com/v1',
    headers: {
      Accept: 'application/json, text/plain, */*',
    },
  });

  return (
    <CatApiClientContext.Provider value={instance}>
      { children }
    </CatApiClientContext.Provider>
  )
};
