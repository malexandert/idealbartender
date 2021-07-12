import React from 'react';

import { useHistory } from 'react-router-dom';
import Button, { Variant } from '@leafygreen-ui/button';
import { Body } from '@leafygreen-ui/typography';

import './login-page.css';

const LoginButtons = () => {
  const history = useHistory();

  return (
    <div className="login-page">
      <Body>Sign up or log in to keep track of your recipes</Body>
      <div className="login-page-buttons">
        <Button
          className="login-page-button"
          variant={Variant.Primary}
          onClick={() => history?.push('/register')}
        >
          Sign Up
        </Button>
        <Button
          className="login-page-button"
          onClick={() => history?.push('/login')}
        >
          Log In
        </Button>
      </div>
    </div>

  );
};

export default LoginButtons;