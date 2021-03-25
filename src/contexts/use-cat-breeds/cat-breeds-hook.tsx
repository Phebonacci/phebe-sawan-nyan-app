import React from 'react';
import { CatBreedsContext } from './cat-breeds-context';

export const useCatBreeds = () => React.useContext(CatBreedsContext);
