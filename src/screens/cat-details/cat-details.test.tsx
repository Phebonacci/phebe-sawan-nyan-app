import React from 'react';
import { AxiosInstance } from 'axios';
import { render } from '@testing-library/react';
import { CatDetails } from './cat-details';
import * as Contexts from '../../contexts';
import * as ReactRouter from 'react-router';

jest.mock('react-router');
jest.mock('../../contexts');

describe('<CatDetails />', () => {
  beforeEach(() => {
    jest.spyOn(ReactRouter, 'useParams').mockReturnValue({
      id: '111',
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the details of the cat given an id', async () => {
    const name = 'All American Cats';
    const origin = 'United States of America';
    const temperament = 'Intelligent, grumpy, moody';
    const description = 'Lorem ipsum dolor sit amet';
    jest.spyOn(Contexts, 'useCatApiClient').mockReturnValue(({
      get: jest.fn().mockResolvedValue({
        data: {
          id: '111',
          url: 'http://localhost:8080/111.jpg',
          breeds: [
            {
              id: 'aaa',
              name,
              origin,
              temperament,
              description,
            },
          ],
        },
      }),
    } as unknown) as AxiosInstance);
    const { findByText, queryByText } = render(<CatDetails />);
    await findByText(name);
    await findByText(new RegExp(origin));
    await findByText(temperament);
    await findByText(description);
    expect(queryByText('We failed to load the cat details. Pls trya again later.')).not.toBeInTheDocument();
  });

  it('renders the error message if fetching the details fail', async () => {
    jest.spyOn(Contexts, 'useCatApiClient').mockReturnValue(({
      get: jest.fn().mockRejectedValue(new Error('Failed to fetch')),
    } as unknown) as AxiosInstance);
    const { findByText } = render(<CatDetails />);
    await findByText('Apologies but we could not load the cat details for you at this time. Miau!');
  });
});
