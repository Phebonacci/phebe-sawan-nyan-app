import { render } from '@testing-library/react';
import React from 'react';
import { HomePage } from './home-page';
import * as Contexts from '../../contexts';
import * as CatsLookup from './use-cats-lookup';
import * as Hooks from '../../hooks';
import { Breed } from '../../models';
import { MemoryRouter } from 'react-router';

jest.mock('../../contexts');
jest.mock('./use-cats-lookup');
jest.mock('../../hooks');

const renderWithRoute = () => render(
  <MemoryRouter>
    <HomePage />
  </MemoryRouter>
)

describe('<HomePage />', () => {
  const mockBreeds = [
    {
      id: 'aaa',
      name: 'American All Stars',
    },
    {
      id: 'bbb',
      name: 'Big Bouncy Cats',
    },
    {
      id: 'ccc',
      name: 'Cute Cuddly Cats',
    },
  ] as Breed[];

  beforeEach(() => {
    jest.spyOn(Hooks, 'useQuery').mockReturnValue(({
      get: jest.fn(),
    } as unknown) as URLSearchParams);
    jest.spyOn(CatsLookup, 'useCatsLookup').mockReturnValue(({
      page: 1,
      loading: false,
      cats: [],
      loadCats: jest.fn(),
      canLoadMore: jest.fn(),
    } as unknown) as CatsLookup.CatsLookupHook);
    jest.spyOn(Contexts, 'useCatBreeds').mockReturnValue({
      status: 'fetched',
      list: mockBreeds,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the breeds dropdown as enabled if the breeds have been fetched successfully', () => {
    const { queryByLabelText, queryByText } = render(<HomePage />);
    expect(queryByLabelText('Breed')).toBeVisible();
    expect(queryByLabelText('Breed')).toBeEnabled();
    expect(queryByText('American All Stars')).toBeInTheDocument();
    expect(queryByText('Big Bouncy Cats')).toBeInTheDocument();
    expect(queryByText('Cute Cuddly Cats')).toBeInTheDocument();
  });

  it('renders the breeds dropdown as disabled if the breeds are still being fetched', () => {
    jest.spyOn(Contexts, 'useCatBreeds').mockReturnValue({
      status: 'loading',
      list: [],
    });

    const { queryByLabelText } = render(<HomePage />);
    expect(queryByLabelText('Breed')).toBeVisible();
    expect(queryByLabelText('Breed')).toBeDisabled();
  });

  it('renders the breeds dropdown as disabled and shows an error message if fetching the breeds failed', () => {
    jest.spyOn(Contexts, 'useCatBreeds').mockReturnValue({
      status: 'failed',
      list: [],
    });

    const { queryByLabelText, queryByText } = render(<HomePage />);
    expect(queryByLabelText('Breed')).toBeVisible();
    expect(queryByLabelText('Breed')).toBeDisabled();
    expect(queryByText('Apologies but we could not load new cats for you at this time! Miau!')).toBeVisible();
  });

  it('renders the list of cats given the selected breed', () => {
    const mockCats = [
      {
        id: '123',
        url: 'http://localhost:8080/123.jpg',
        breeds: [],
      },
      {
        id: '456',
        url: 'http://localhost:8080/456.jpg',
        breeds: [],
      },
      {
        id: '567',
        url: 'http://localhost:8080/567.jpg',
        breeds: [],
      },
    ];
    jest.spyOn(CatsLookup, 'useCatsLookup').mockReturnValue(({
      page: 1,
      loading: false,
      cats: mockCats,
      loadCats: jest.fn(),
      canLoadMore: jest.fn(),
    } as unknown) as CatsLookup.CatsLookupHook);

    const { queryByTestId } = renderWithRoute();
    mockCats.forEach((cat) => {
      const catElement = queryByTestId(cat.id);
      expect(catElement).toBeVisible();
      expect(catElement).toHaveProperty('innerHTML', expect.stringContaining(cat.url));
    });
  });

  it('renders the error message for the cats lookup if any', () => {
    const mockErrorMessage = 'Cats Lookup failed';
    jest.spyOn(CatsLookup, 'useCatsLookup').mockReturnValue(({
      page: 1,
      loading: false,
      cats: [],
      errorMessage: mockErrorMessage,
      loadCats: jest.fn(),
      canLoadMore: jest.fn(),
    } as unknown) as CatsLookup.CatsLookupHook);

    const { queryByText } = renderWithRoute();
    expect(queryByText(mockErrorMessage)).toBeVisible();
  });
});
