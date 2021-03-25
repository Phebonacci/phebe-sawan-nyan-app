import React from 'react';
import { CatApiClientContext } from './cat-api-client-context';

export const useCatApiClient = () => React.useContext(CatApiClientContext);
