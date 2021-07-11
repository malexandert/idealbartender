import React from 'react';
import { createBrowserHistory } from 'history';
import { Route, Router, Switch } from 'react-router-dom';
import Card from '@leafygreen-ui/card';

import App from './Home';
import { LoginForm } from './login-page';

import './router.css';

const history = createBrowserHistory();

const AppRouter = () => (
  <Router history={history}>
    <div className="App">
      <Card className="App-card">
        <Switch>
          <Route path="/login">
            <LoginForm />
          </Route>
          <Route path="/">
            <App />
          </Route>
        </Switch>
      </Card>
    </div>
  </Router>
);

export default AppRouter;