import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { Cat } from '../../models';
import './cats-list.scss';

interface CatListProps {
  list: Cat[]
}

export const CatsList: React.FC<CatListProps> = ({ list }) => {
  return (
    <Container fluid className='cats-list-root'>
      <Row md={4} sm={2} xs={1} className='row'>
        {
          list.length > 0 && list.map((item) => (
            <Col key={item.id} data-testid={item.id}>
              <Card className='card'>
                <Card.Img variant='top' src={item.url} />
                <Card.Body>
                  <Link to={item.id}>
                    <Button variant='primary' block>
                      View details
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        }
        {
          list.length === 0 && <Col>No cats available.</Col>
        }
      </Row>
    </Container>
  )
};
