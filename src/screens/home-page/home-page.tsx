import React, { useEffect, useMemo, useState } from 'react';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router';
import { Select, SelectOption } from '../../components';
import { AlertError } from '../../components';
import { useCatBreeds } from '../../contexts';
import { useQuery } from '../../hooks';
import { CatsList } from './cats-list';
import { useCatsLookup } from './use-cats-lookup';
import './home-page.scss';

export const HomePage: React.FC = () => {
  const catBreeds = useCatBreeds();
  const history = useHistory();
  const query = useQuery();
  const catsLookup = useCatsLookup();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const catBreedOptions: SelectOption[] = useMemo(() => {
    return catBreeds.list.map((breed) => ({ name: breed.name, value: breed.id }));
  }, [catBreeds]);

  const onBreedSelect = (breedId: string) => {
    catsLookup.loadCats(breedId);
    history.push({
      pathname: '',
      search: `?breed=${breedId}`,
    });
  };

  useEffect(() => {
    if (query.get('breed') !== catsLookup.currentFilter) {
      catsLookup.loadCats(query.get('breed') ?? '');
    }
  }, [query, catsLookup]);

  useEffect(() => {
    if (catBreeds.status === 'failed') {
      setErrorMessage('We failed to load the cat breeds. Pls try again later.');
    } else if (catsLookup.errorMessage) {
      setErrorMessage(catsLookup.errorMessage);
    }
  }, [catBreeds, catsLookup.errorMessage])

  const clearError = () => {
    setErrorMessage(null);
    catsLookup.clearError();
  }

  return (
    <Container className='home-page-root'>
      <h1>Cat Browser</h1>
      {
        errorMessage && (
          <AlertError message={errorMessage} onClose={clearError}
          />
        )
      }
      <Select
        id='breed'
        label='Breed'
        value={catsLookup.currentFilter}
        options={catBreedOptions}
        onChange={onBreedSelect}
        disabled={catBreedOptions.length === 0 || catsLookup.loading}
      />
      <CatsList list={catsLookup.cats} />
      {
        catsLookup.canLoadMore() && (
          <Button variant='primary' onClick={catsLookup.loadMore} disabled={catsLookup.loading}>
            {
              catsLookup.loading ? 'Loading more...' : 'Load more'
            }
          </Button>
        )
      }
    </Container>
  );
};
