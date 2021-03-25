import React, { useEffect, useState } from 'react';
import { useCatApiClient } from '../use-cat-api-client';
import { CatBreedsStatus } from '.';
import { CatBreedsContext } from './cat-breeds-context';
import { Breed } from '../../models';

export const CatBreedsContextProvider: React.FC = ({ children }) => {
  const [catBreeds, setCatBreeds] = useState<Breed[]>([]);
  const [status, setStatus] = useState<CatBreedsStatus>('loading');
  const catApiClient = useCatApiClient();

  useEffect(() => {
    let cancel = false;

    catApiClient.get<Breed[]>('/breeds')
      .then(({ data }) => {
        if (cancel) return;
        setCatBreeds(data);
        setStatus('fetched');
      })
      .catch((error) => {
        if (cancel) return;
        // TODO: use a proper logger
        console.error('Failed to fetch the cat breeds', error);
        setCatBreeds([]);
        setStatus('failed');
      });

    return () => {
      cancel = true;
    }
  }, [catApiClient]);

  return (
    <CatBreedsContext.Provider value={{ status, list: catBreeds }}>
      {children}
    </CatBreedsContext.Provider>
  );
};
