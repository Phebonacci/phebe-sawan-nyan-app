import { useCallback, useEffect, useState } from 'react';
import { uniqBy } from 'lodash';
import { useCatApiClient } from '../../contexts';
import { Cat } from '../../models';

export interface CatsLookupHook {
  page: number
  cats: Cat[]
  loading: boolean
  currentFilter: string
  errorMessage: string | null
  canLoadMore: () => boolean
  clearError: () => void
  loadCats: (breedFilter: string) => void
  loadMore: () => void
}

export const useCatsLookup = ({ limit = 10 } = {}): CatsLookupHook => {
  const catApiClient = useCatApiClient();

  const [page, setPage] = useState<number>(1);
  const [cats, setCats] = useState<Cat[]>([]);
  const [breedFilter, setBreedFilter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCatsByFilter = useCallback(() => {
    return catApiClient.get<Cat[]>('/images/search', {
      params: {
        page,
        limit,
        breed_id: breedFilter,
      },
    })
      .then(({ data }) => {
        return data;
      });
  }, [catApiClient, page, limit, breedFilter]);

  const updateCatsList = (newList: Cat[]) => {
    if (page === 1) {
      setCats(newList);
    } else {
      setCats(uniqBy([...cats, ...newList], 'id'));
    }
  };

  useEffect(() => {
    let cancel = false;

    if (breedFilter) {
      setLoading(true);
      fetchCatsByFilter().then((data) => {
        if (cancel) return;
        setLoading(false);
        updateCatsList(data);
      })
        .catch(() => {
          if (cancel) return;
          setLoading(false);
          setErrorMessage('We failed to load the cats. Pls try again.');
        });
    } else {
      setCats([]);
    }

    return () => {
      cancel = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breedFilter, page, fetchCatsByFilter]);

  const canLoadMore = () => {
    return cats.length > 0 && cats.length % limit === 0;
  };

  const clearError = () => setErrorMessage('');

  const loadCats = (breedFilter: string) => {
    setBreedFilter(breedFilter);
    setPage(1);
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  return {
    page,
    cats,
    loading,
    currentFilter: breedFilter,
    errorMessage,
    canLoadMore,
    clearError,
    loadCats,
    loadMore,
  };
};
