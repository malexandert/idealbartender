import React from 'react';
import { createBrowserHistory } from 'history';
import { Route, Router, Switch } from 'react-router-dom';
import Card from '@leafygreen-ui/card';

import { AddRecipe } from './add-recipe';
import App from './Home';
import { LoginForm, RegisterForm } from './login-page';
import { Timeline } from './timeline';

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
          <Route path="/register">
            <RegisterForm />
          </Route>
          <Route path="/timeline">
            <Timeline />
          </Route>
          <Route path="/add">
            <AddRecipe />
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
