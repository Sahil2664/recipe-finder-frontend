import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://www.themealdb.com/api/json/v1/1";

export default function RecipeCard({ meal, isFav, onToggleFavorite }) {
  const [details, setDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // meal may be a lightweight object from filter.php (no instructions). Load details on demand.
  const loadDetails = async () => {
    if (details) { setOpen(true); return; }
    setLoadingDetails(true);
    try {
      const id = meal.idMeal;
      const res = await axios.get(`${API}/lookup.php?i=${id}`);
      setDetails(res.data.meals?.[0] || null);
      setOpen(true);
    } catch (e) {
      console.error("Failed to load details", e);
    } finally {
      setLoadingDetails(false);
    }
  };

  // helper: build array of ingredient lines
  const ingredientLines = (d) => {
    if (!d) return [];
    const lines = [];
    for (let i = 1; i <= 20; i++) {
      const ing = d[`strIngredient${i}`];
      const measure = d[`strMeasure${i}`];
      if (ing && ing.trim()) {
        lines.push(`${measure ? measure.trim() + " " : ""}${ing.trim()}`);
      }
    }
    return lines;
  };

  // In list view some objects have no strMealThumb (rare) — use safe access
  const thumb = meal.strMealThumb;

  return (
    <div className="card">
      <div className="card-top">
        <img src={thumb} alt={meal.strMeal} />
      </div>

      <div className="card-body">
        <h3>{meal.strMeal}</h3>
        {meal.strCategory && <small className="muted">{meal.strCategory}</small>}
        <div className="card-actions">
          <button className="btn" onClick={loadDetails}>{loadingDetails ? "Loading..." : "View"}</button>
          <button
            className={`fav ${isFav ? "active" : ""}`}
            onClick={() => onToggleFavorite({ idMeal: meal.idMeal, strMeal: meal.strMeal, strMealThumb: meal.strMealThumb })}
            aria-label="Toggle favorite"
          >
            {isFav ? "♥ Saved" : "♡ Save"}
          </button>
        </div>
      </div>

      {/* DETAILS MODAL */}
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(false)}>✕</button>
            <div className="modal-main">
              <img src={details?.strMealThumb || thumb} alt={details?.strMeal || meal.strMeal} />
              <h2>{details?.strMeal || meal.strMeal}</h2>
              <p className="muted">{details?.strCategory} • {details?.strArea}</p>

              <h4>Ingredients</h4>
              <ul className="ings">
                {ingredientLines(details).map((l, i) => <li key={i}>{l}</li>)}
              </ul>

              <h4>Instructions</h4>
              <p className="instructions">{details?.strInstructions || "No instructions available."}</p>

              {details?.strYoutube && (
                <div className="video">
                  <h4>Video</h4>
                  <iframe
                    title="recipe-video"
                    width="100%"
                    height="220"
                    src={`https://www.youtube.com/embed/${new URL(details.strYoutube).searchParams.get("v") || details.strYoutube.split("v=")[1] || ""}`}
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
