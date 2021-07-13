import { useState } from 'react';

import { useHistory } from 'react-router-dom';
import * as Realm from 'realm-web';
import Banner, { Variant as BannerVariant } from '@leafygreen-ui/banner';
import Button, { Variant as ButtonVariant } from '@leafygreen-ui/button';
import TextInput from '@leafygreen-ui/text-input';
import Toggle from '@leafygreen-ui/toggle';
import { Description } from '@leafygreen-ui/typography';

import { REALM_APP_ID } from '../constants';

import './add-recipe.css';

const AddRecipe = () => {
  const app = new Realm.App({ id: REALM_APP_ID });

  const mongodb = app.currentUser?.mongoClient('mongodb-atlas');
  const recipesCollection = mongodb?.db('idealbartender').collection('recipes');
  const secretRecipesCollection = mongodb?.db('idealbartender').collection('secretRecipes');

  const [recipeTitle, setRecipeTitle] = useState<string>();
  const [ingredients, setIngredients] = useState<string>();
  const [method, setMethod] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [secretRecipe, setSecretRepice] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const history = useHistory();

  const handleAddRecipe = async () => {
    try {
      setLoading(true);
      if (secretRecipe) {
        await secretRecipesCollection?.insertOne({
          userId: app.currentUser?.id,
          recipeTitle,
          ingredients,
          method,
        })
      } else {
        await recipesCollection?.insertOne({
          userId: app.currentUser?.id,
          recipeTitle,
          ingredients,
          method,
        });
      }
      setLoading(false);
      history?.push('/timeline');
    } catch (e) {
      console.log(e);
      setLoading(false);
      setError('Failed to add new recipe');
    }
  };

  return (
    <div className="add-recipe">
      {error && (
        <Banner
          className="add-recipe-error-banner"
          variant={BannerVariant.Danger}
          dismissible
          onClose={() => setError(undefined)}
        >
          {error}
        </Banner>
      )}
      <TextInput
        className="add-recipe-input"
        label="Recipe Title"
        description="Enter the title of your recipe here"
        placeholder="Daiquiri"
        onChange={(e) => setRecipeTitle(e.target.value)}
        disabled={loading}
      />
      <TextInput
        className="add-recipe-input"
        label="Ingredients"
        description="Enter the ingredients for your recipe here"
        placeholder="Ingredients here..."
        onChange={(e) => setIngredients(e.target.value)}
        disabled={loading}
      />
      <TextInput
        className="add-recipe-input"
        label="Method"
        description="How do you prepare your recipe?"
        placeholder="Shaken, not stirred"
        onChange={(e) => setMethod(e.target.value)}
        disabled={loading}
      />
      <div>
        <label id="private-recipe-toggle">
          <b>Private Recipe</b>
        </label>
        <Toggle
          id="toggle"
          aria-labelledby="private-recipe-toggle"
          onChange={(checked) => setSecretRepice(checked)}
        />
        <Description>Private recipes will not show up for other users</Description>
      </div>
      <div className="login-form-buttons">
        <Button
          variant={ButtonVariant.Primary}
          onClick={handleAddRecipe}
        >
          Submit
        </Button>
        <Button onClick={() => history?.push('/timeline')}>Cancel</Button>
      </div>
    </div>
  );
};

export default AddRecipe;
