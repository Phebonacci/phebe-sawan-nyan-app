import { AxiosInstance } from 'axios';
import { act, renderHook } from '@testing-library/react-hooks';
import { useCatBreeds } from './cat-breeds-hook';
import { CatBreedsContextProvider } from './cat-breeds-provider';
import * as catApiClientContext from '../use-cat-api-client';

jest.mock('../use-cat-api-client');

describe('useCatBreeds', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches the cat breeds and sets the response into the context', async () => {
    const mockCatApiClient = ({
      get: jest.fn().mockResolvedValue({
          data: [
            {
              id: 'aob',
              name: 'American Orange Bobtailed',
            },
            {
              id: 'gf',
              name: 'Garfield',
            },
          ],
        }),
    } as unknown) as AxiosInstance;
    jest.spyOn(catApiClientContext, 'useCatApiClient')
      .mockReturnValue(mockCatApiClient);

    const { result } = renderHook(useCatBreeds, {
      wrapper: ({ children }) => (
        <CatBreedsContextProvider>{children}</CatBreedsContextProvider>
      ),
    });
    await act(async () => {});
    expect(mockCatApiClient.get).toHaveBeenCalledTimes(1);
    expect(mockCatApiClient.get).toHaveBeenCalledWith('/breeds');
    expect(result.current).toStrictEqual({
      status: 'fetched',
      list: [
        {
          id: 'aob',
          name: 'American Orange Bobtailed',
        },
        {
          id: 'gf',
          name: 'Garfield',
        },
      ],
    });
  });

  it('sets the cat breeds state to an empty array when fetching the cat breeds fail', async () => {
    const mockCatApiClient = ({
      get: jest.fn().mockRejectedValue(new Error('Failed to fetch the cat breeds.')),
    } as unknown) as AxiosInstance;
    jest.spyOn(catApiClientContext, 'useCatApiClient')
      .mockReturnValue(mockCatApiClient);

    const { result } = renderHook(useCatBreeds, {
      wrapper: ({ children }) => (
        <CatBreedsContextProvider>{children}</CatBreedsContextProvider>
      ),
    });
    await act(async () => {});
    expect(mockCatApiClient.get).toHaveBeenCalledTimes(1);
    expect(mockCatApiClient.get).toHaveBeenCalledWith('/breeds');
    expect(result.current).toStrictEqual({
      status: 'failed',
      list: [],
    });
  });
});
