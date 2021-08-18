import { H2 } from '@leafygreen-ui/typography';

import { LoginButtons } from './login-page';

import './home.css';

const Home = () => {
  return (
    <>
      <H2 className="Home-header">
        Welcome to my house! go away!
      </H2>
      <LoginButtons />
    </>
  );
};

export default Home;
