import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import * as Realm from 'realm-web';
import Banner, { Variant as BannerVariant } from '@leafygreen-ui/banner';
import Button, { Variant as ButtonVariant } from '@leafygreen-ui/button';
import Card from '@leafygreen-ui/card';
import { Body, H2 } from '@leafygreen-ui/typography';

import { REALM_APP_ID } from '../constants';

import './timeline.css';

const Timeline = () => {
  const app = new Realm.App({ id: REALM_APP_ID });

  const mongodb = app.currentUser?.mongoClient('mongodb-atlas');
  const recipesCollection = mongodb?.db('idealbartender').collection('recipes');
  const secretRecipesCollection = mongodb?.db('idealbartender').collection('secretRecipes');

  const [recipes, setRecipes] = useState<any[]>();
  const [secretRecipes, setSecretRecipes] = useState<any[]>();
  const [error, setError] = useState<string | undefined>();

  const history = useHistory();

  useEffect(() => {
    const loadDataAsync = async () => {
      try {
        const recipes = await recipesCollection?.find({});
        const secretRecipes = await secretRecipesCollection?.find({});
        if (recipes) {
          console.log(recipes);
          setRecipes(recipes.reverse());
        }
        if (secretRecipes) {
          setSecretRecipes(secretRecipes.reverse());
        }
      } catch (e) {
        setError(e);
      }
    };

    loadDataAsync();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await app.currentUser?.logOut();
    history?.push('/');
  };

  const handleDelete = async (id: string) => {
    try {
      await recipesCollection?.deleteOne({ _id: id });
      const recipes = await recipesCollection?.find({});
      const secretRecipes = await secretRecipesCollection?.find({});
      if (recipes) {
        console.log(recipes);
        setRecipes(recipes.reverse());
      }
      if (secretRecipes) {
        setSecretRecipes(secretRecipes.reverse());
      }
    } catch {
      setError('You can only delete your own recipes');
    }
  };

  return (
    <div className="timeline">
      <H2 className="Home-header">
        Welcome to The Ideal Bartender
      </H2>
      {error && (
        <Banner
          className="timeline-error-banner"
          variant={BannerVariant.Danger}
          dismissible
          onClose={() => setError(undefined)}
        >
          {error}
        </Banner>
      )}
      <div className="timeline-buttons">
        <Button
          className="timeline-button"
          variant={ButtonVariant.Primary}
          onClick={() => history?.push('/add')}
        >
          Add new recipe
        </Button>
        <Button
          className="timeline-button"
          onClick={handleLogout}
        >
          Log out
        </Button>
      </div>
      {recipes?.map((recipe) => (
        <Card className="timeline-card" key={recipe?._id}>
          {recipe?.userId !== app.currentUser?.id && (
            <Body className="timeline-card-text">
              <b>User ID</b>: <br/> {recipe?.userId}
            </Body>
          )}
          <Body className="timeline-card-text">
            <b>Recipe Title</b>: <br /> {recipe?.recipeTitle}
          </Body>
          <Body className="timeline-card-text">
            <b>Ingredients</b>: <br /> {recipe?.ingredients}
          </Body>
          <Body className="timeline-card-text">
            <b>Method</b> <br /> {recipe?.method}
          </Body>
          <div>
            <Button
              variant={ButtonVariant.Danger}
              onClick={() => handleDelete(recipe?._id)}
            >
              Delete Recipe
            </Button>
          </div>
        </Card>
      ))}
      {secretRecipes?.map((recipe) => (
        <Card className="timeline-secret-card" key={recipe?._id}>
          <Body className="timeline-card-text">
            <b>Recipe Title</b>: <br /> {recipe?.recipeTitle}
          </Body>
          <Body className="timeline-card-text">
            <b>Ingredients</b>: <br /> {recipe?.ingredients}
          </Body>
          <Body className="timeline-card-text">
            <b>Method</b> <br /> {recipe?.method}
          </Body>
        </Card>
      ))}
    </div>
  );
};

export default Timeline;
