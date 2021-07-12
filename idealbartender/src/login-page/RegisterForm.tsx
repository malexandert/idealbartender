import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import * as Realm from 'realm-web';
import Banner, { Variant as BannerVariant} from '@leafygreen-ui/banner';
import Button, { Variant as ButtonVariant } from '@leafygreen-ui/button';
import TextInput, { State as TextInputState } from '@leafygreen-ui/text-input';

import { REALM_APP_ID } from '../constants';

const app = new Realm.App({ id: REALM_APP_ID });

const RegisterForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>();
  const [emailState, setEmailState] = useState<TextInputState>(TextInputState.None);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [password, setPassword] = useState<string>();
  const [passwordState, setPasswordState] = useState<TextInputState>(TextInputState.None);
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [confirmPasswordState, setConfirmPasswordState] = useState<TextInputState>(TextInputState.None);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>();
  const [error, setError] = useState();

  const history = useHistory();

  
  const validateEmail = () => {
    setEmailError(undefined);
    if ((email?.length ?? 0) === 0) {
      setEmailState(TextInputState.Error);
      setEmailError('Email cannot be empty');
    } else {
      setEmailState(TextInputState.Valid);
    }
  };

  const validatePassword = () => {
    setPasswordError(undefined);
    if ((password?.length ?? 0) < 8) {
      setPasswordState(TextInputState.Error);
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordState(TextInputState.Valid);
    }
  };

  const validateConfirmPassword = () => {
    setConfirmPasswordError(undefined);
    if (confirmPassword !== password) {
      setConfirmPasswordState(TextInputState.Error);
      setConfirmPasswordError('Passwords are not the same');
    } else {
      setConfirmPasswordState(TextInputState.Valid);
    }
  };

  const handleSignup = async () => {
    setError(undefined);
    setLoading(true);

    if (email && password && (password === confirmPassword)) {
      try {
        await app.emailPasswordAuth.registerUser(email, password);
      } catch (e) {
        setError(e.error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="register-form">
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
        state={emailState}
        errorMessage={emailError}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={validateEmail}
        disabled={loading}
      />
      <TextInput
        className="login-form-input"
        label="Password"
        type="password"
        description="Enter your password"
        placeholder="********"
        state={passwordState}
        errorMessage={passwordError}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={validatePassword}
        disabled={loading}
      />
      <TextInput
        className="login-form-input"
        label="Confirm Password"
        type="password"
        description="Confirm your password"
        placeholder="********"
        state={confirmPasswordState}
        errorMessage={confirmPasswordError}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onBlur={validateConfirmPassword}
        disabled={loading}
      />
      <div className="login-form-buttons">
        <Button
          variant={ButtonVariant.Primary}
          disabled={loading}
        >
          Submit
        </Button>
        <Button onClick={() => history?.push('/')} disabled={loading}>
          Cancel
        </Button>
      </div>
    </div>
  )
};

export default RegisterForm;
