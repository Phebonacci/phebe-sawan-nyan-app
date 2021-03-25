import { AxiosInstance } from 'axios';
import { act, renderHook } from '@testing-library/react-hooks';
import { useCatsLookup } from './use-cats-lookup';
import * as CatApiClientContext from '../../contexts/use-cat-api-client';

jest.mock('../../contexts/use-cat-api-client');

describe('useCatsLookup', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockResponse = {
    data: [
      {
        id: '1234',
        url: 'http://localhost:8080/1234.jpg',
        breeds: [],
      },
      {
        id: '4567',
        url: 'http://localhost:8080/4567.jpg',
        breeds: [],
      },
    ],
  };

  it('fetches the first page of the cats lookup by filter when calling loadCats', async () => {
    const mockCatApiClient = ({
      get: jest.fn().mockResolvedValue(mockResponse),
    } as unknown) as AxiosInstance;
    jest.spyOn(CatApiClientContext, 'useCatApiClient')
      .mockReturnValue(mockCatApiClient);

    const { result } = renderHook(useCatsLookup)
    expect(result.current.loading).toBe(false);
    expect(result.current.page).toBe(1);
    expect(result.current.cats).toStrictEqual([]);
    expect(result.current.currentFilter).toBe('');
    expect(result.current.errorMessage).toBeNull();
    await act(async () => {
      result.current.loadCats('aaa');
    });
    expect(result.current.currentFilter).toBe('aaa');
    await act(async () => {});
    expect(result.current.loading).toBe(false);
    expect(result.current.cats).toStrictEqual(mockResponse.data);
    expect(result.current.errorMessage).toBeNull();
  });

  it('fetches the next page of the cats lookup when calling loadMore', async () => {
    const mockCatApiClient = ({
      get: jest.fn().mockResolvedValue(mockResponse),
    } as unknown) as AxiosInstance;
    jest.spyOn(CatApiClientContext, 'useCatApiClient')
      .mockReturnValue(mockCatApiClient);

    const { result } = renderHook(useCatsLookup);
    await act(async () => {
      result.current.loadCats('aaa');
    });
    expect(result.current.page).toBe(1);
    expect(result.current.currentFilter).toBe('aaa');
    expect(result.current.loading).toBe(false);
    expect(result.current.cats).toStrictEqual(mockResponse.data);
    expect(result.current.errorMessage).toBeNull();
    await act(async () => {
      result.current.loadMore();
    });
    expect(result.current.page).toBe(2);
    expect(result.current.currentFilter).toBe('aaa');
    expect(result.current.loading).toBe(false);
    expect(result.current.cats).toStrictEqual(mockResponse.data);
    expect(result.current.errorMessage).toBeNull();
  });

  it('returns an errorMessage when loading the cats fail', async () => {
    const mockCatApiClient = ({
      get: jest.fn().mockRejectedValue(new Error('Failed to fetch')),
    } as unknown) as AxiosInstance;
    jest.spyOn(CatApiClientContext, 'useCatApiClient')
      .mockReturnValue(mockCatApiClient);

    const { result } = renderHook(useCatsLookup)
    expect(result.current.errorMessage).toBeNull();
    await act(async () => {
      result.current.loadCats('aaa');
    });
    expect(result.current.errorMessage).not.toBeNull();
  });

  describe('canLoadMore', () => {
    it('returns true if the cats list length of the last page is equal to the limit', async () => {
      const mockCatApiClient = ({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as unknown) as AxiosInstance;
      jest.spyOn(CatApiClientContext, 'useCatApiClient')
        .mockReturnValue(mockCatApiClient);

      const { result } = renderHook(useCatsLookup, {
        initialProps: { limit: 2 },
      })
      await act(async () => {
        result.current.loadCats('aaa');
      });
      expect(result.current.page).toBe(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.cats).toStrictEqual(mockResponse.data);
      expect(result.current.errorMessage).toBeNull();
      expect(result.current.canLoadMore()).toBe(true);
    });

    it('returns false if the cats list length of the last page is less than the limit', async () => {
      const mockCatApiClient = ({
        get: jest.fn().mockResolvedValue(mockResponse),
      } as unknown) as AxiosInstance;
      jest.spyOn(CatApiClientContext, 'useCatApiClient')
        .mockReturnValue(mockCatApiClient);

      const { result } = renderHook(useCatsLookup)
      await act(async () => {
        result.current.loadCats('aaa');
      });
      expect(result.current.page).toBe(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.cats).toStrictEqual(mockResponse.data);
      expect(result.current.errorMessage).toBeNull();
      expect(result.current.canLoadMore()).toBe(false);
    });
  });
});
