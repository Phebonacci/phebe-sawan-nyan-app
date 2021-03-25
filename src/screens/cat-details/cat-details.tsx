import React, { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useHistory, useParams } from 'react-router';
import { useCatApiClient } from '../../contexts';
import { Cat } from '../../models';
import { AlertError } from '../../components/alert-error';
import './cat-details.scss';

export const CatDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const catApiClient = useCatApiClient();
  const history = useHistory();

  const [catDetails, setCatDetails] = useState<Cat | null>(null);
  const [loadingCatDetails, setLoadingCatDetails] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchCatDetails = useCallback(() => {
    return catApiClient.get<Cat>(`/images/${id}`)
      .then(({ data }) => data);
  }, [id, catApiClient]);

  useEffect(() => {
    let cancel = false;

    if (id) {
      setLoadingCatDetails(true);
      fetchCatDetails().then((data) => {
        if (cancel) return;
        setCatDetails(data);
        setLoadingCatDetails(false);
      })
        .catch(() => {
          if (cancel) return;
          setLoadingCatDetails(false);
          setErrorMessage('Apologies but we could not load the cat details for you at this time. Miau!');
        });
    }

    return () => {
      cancel = true;
    };
  }, [id, fetchCatDetails]);

  const goBack = () => history.goBack();

  const breed = catDetails?.breeds[0];

  return (
    <Container className='cat-details-root'>
      {
        errorMessage && (
          <AlertError message={errorMessage} onClose={() => setErrorMessage('')} />
        )
      }
      {
        loadingCatDetails && <h4>Loading...</h4>
      }
      {
        catDetails && breed && (
          <Card>
            <Card.Header>
              <Button variant='primary' onClick={goBack}>Back</Button>
            </Card.Header>
            <Card.Img variant='top' src={catDetails.url} />
            <Card.Body>
              <Card.Title as='h4'>{breed.name}</Card.Title>
              <Card.Title as='h5'>Origin: {breed.origin}</Card.Title>
              <Card.Title as='h6'>{breed.temperament}</Card.Title>
              <Card.Text>{breed.description}</Card.Text>
            </Card.Body>
          </Card>
        )
      }
    </Container>
  );
};
