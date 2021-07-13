import React, { useEffect, useState } from 'react';

import * as Realm from 'realm-web';
import Card from '@leafygreen-ui/card';
import { Body, H2 } from '@leafygreen-ui/typography';

import { REALM_APP_ID } from '../constants';

import './timeline.css';

const app = new Realm.App({ id: REALM_APP_ID });

const mongodb = app.currentUser?.mongoClient('mongodb-atlas');
const recipesCollection = mongodb?.db('idealbartender').collection('recipes');

const Timeline = () => {
  const [recipes, setRecipes] = useState<any[]>();


  useEffect(() => {
    const loadDataAsync = async () => {
      try {
        const recipes = await recipesCollection?.find({});
        if (recipes) {
          setRecipes(recipes.reverse());
        }
      } catch (e) {
        console.log(e);
      }
    };

    loadDataAsync();
  }, []);

  return (
    <div className="timeline">
      <H2 className="Home-header">
        Welcome to The Ideal Bartender
      </H2>
      {recipes?.map((recipe) => (
        <Card className="timeline-card" key={recipe?.userId}>
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
        </Card>
      ))}
    </div>
  );
};

export default Timeline;
