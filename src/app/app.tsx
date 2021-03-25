import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { CatApiClientContextProvider, CatBreedsContextProvider } from '../contexts';
import { HomePage, CatDetails } from '../screens';

import 'bootstrap/dist/css/bootstrap.min.css';

const Routes: React.FC = () => (
  <Router>
    <Switch>
      <Route exact path='/'>
        <HomePage />
      </Route>
      <Route path='/:id' >
        <CatDetails />
      </Route>
    </Switch>
  </Router>
);

const App: React.FC = () => {
  return (
    <CatApiClientContextProvider>
      <CatBreedsContextProvider>
        <Routes />
      </CatBreedsContextProvider>
    </CatApiClientContextProvider>
  );
};

export default App;
