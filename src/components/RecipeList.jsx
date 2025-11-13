import React, { useState } from "react";
import RecipeCard from "./RecipeCard";

export default function RecipeList({ recipes, loading, onToggleFavorite, favorites = [], showAsFavoritesView = false }) {
  // recipes may be an empty array or contain lighter objects from filter.php
  if (loading) {
    // show 6 skeleton cards
    return <div className="recipe-list">{Array.from({length:6}).map((_,i)=><div className="card-skel" key={i}><div className="img-skel"/><div className="txt-skel"/></div>)}</div>;
  }

  if (!recipes || recipes.length === 0) {
    return <p className="empty">No recipes to show — try searching or pick a category.</p>;
  }

  // prepare a set of fav ids to mark favorites
  const favIds = new Set(favorites.map(f=>f.idMeal));

  return (
    <div className="recipe-list">
      {recipes.map((r) => (
        <RecipeCard
          key={r.idMeal}
          meal={r}
          isFav={favIds.has(r.idMeal)}
          onToggleFavorite={onToggleFavorite}
          showAsFavoritesView={showAsFavoritesView}
        />
      ))}
    </div>
  );
}
