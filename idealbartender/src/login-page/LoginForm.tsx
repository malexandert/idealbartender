import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import * as Realm from 'realm-web';
import Banner, { Variant as BannerVariant} from '@leafygreen-ui/banner';
import Button, { Variant as ButtonVariant } from '@leafygreen-ui/button';
import TextInput from '@leafygreen-ui/text-input';
import { Body } from '@leafygreen-ui/typography';

import { REALM_APP_ID } from '../constants';

const LoginForm = () => {
  const app = new Realm.App({ id : REALM_APP_ID });

  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [user, setUser] = useState<Realm.User | null>(app.currentUser);
  const [error, setError] = useState();

  const history = useHistory();

  const handleLogin = async () => {
    setError(undefined);
    setLoading(true);

    // Log out the current user before we try to log in
    if (user) {
      await app.currentUser?.logOut();
      setUser(null);
    }

    if (email && password) {
      const credentials = Realm.Credentials.emailPassword(email, password);
      try {
        const user = await app.logIn(credentials);
        if (user) {
          setLoading(false);
          history?.push('/timeline');
        }
      } catch (e) {
        setLoading(false);
        setError(e.error);
      }
    }
  };

  return (
    <div className="login-form">
      {error && (
        <Banner
          className="login-form-error-banner"
          variant={BannerVariant.Danger}
        >
          {error}
        </Banner>
      )}
      <TextInput
        className="login-form-input"
        label="Username"
        type="email"
        description="Enter your username"
        placeholder="your.email@website.com"
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <TextInput
        className="login-form-input"
        label="Password"
        type="password"
        description="Enter your password"
        placeholder="********"
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <div className="login-form-buttons">
        <Button
          variant={ButtonVariant.Primary}
          onClick={handleLogin}
          disabled={loading}
        >
          Submit
        </Button>
        <Button onClick={() => history?.push('/')} disabled={loading}>
          Cancel
        </Button>
      </div>
      {user && <Body>{`You're logged in as ${user.id}`}</Body>}
    </div>
  );
};

export default LoginForm;
