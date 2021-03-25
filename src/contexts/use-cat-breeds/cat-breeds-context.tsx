import React from 'react';
import { Breed } from '../../models';

export type CatBreedsStatus = 'loading' | 'failed' | 'fetched';

export interface CatBreeds {
  status: CatBreedsStatus
  list: Breed[]
}

export const CatBreedsContext = React.createContext<CatBreeds>({
  status: 'loading',
  list: [],
});
