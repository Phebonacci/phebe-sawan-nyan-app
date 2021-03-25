import { renderHook } from '@testing-library/react-hooks';
import { useCatApiClient } from './cat-api-client-hook';
import { CatApiClientContextProvider } from './cat-api-client-provider';

describe('useCatApiClient', () => {
  it('uses the cat api base url', () => {
    const { result } = renderHook(useCatApiClient, {
      wrapper: ({ children }) => (
        <CatApiClientContextProvider>{children}</CatApiClientContextProvider>
      ),
    })
    expect(result.current.defaults.baseURL).toEqual('https://api.thecatapi.com/v1');
  });
});
