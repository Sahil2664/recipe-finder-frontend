import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import "./App.css";

const API = "https://www.themealdb.com/api/json/v1/1";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [message, setMessage] = useState("");

  // load favorites from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("rf_favorites");
    if (raw) setFavorites(JSON.parse(raw));
  }, []);

  useEffect(() => {
    // save favorites on change
    localStorage.setItem("rf_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // load categories once
  useEffect(() => {
    const loadCats = async () => {
      try {
        const res = await axios.get(`${API}/categories.php`);
        setCategories(res.data.categories || []);
      } catch (e) {
        console.error("Category fetch error", e);
      }
    };
    loadCats();
  }, []);

  const fetchBySearch = async (q) => {
    setMessage("");
    setShowFavorites(false);
    setSelectedCategory("");
    setLoading(true);
    try {
      const res = await axios.get(`${API}/search.php?s=${encodeURIComponent(q)}`);
      setRecipes(res.data.meals || []);
      if (!res.data.meals) setMessage("No recipes found.");
    } catch (e) {
      console.error(e);
      setMessage("Failed to fetch recipes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchByCategory = async (cat) => {
    setMessage("");
    setShowFavorites(false);
    setSelectedCategory(cat);
    setLoading(true);
    try {
      // filter endpoint returns basic meal items (id, name, thumb)
      const res = await axios.get(`${API}/filter.php?c=${encodeURIComponent(cat)}`);
      setRecipes(res.data.meals || []);
      if (!res.data.meals) setMessage("No recipes in this category.");
    } catch (e) {
      console.error(e);
      setMessage("Failed to fetch category.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRandom = async () => {
    setMessage("");
    setShowFavorites(false);
    setSelectedCategory("");
    setLoading(true);
    try {
      const res = await axios.get(`${API}/random.php`);
      setRecipes(res.data.meals ? res.data.meals : []);
    } catch (e) {
      console.error(e);
      setMessage("Failed to fetch random recipe.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (meal) => {
    const exists = favorites.find((f) => f.idMeal === meal.idMeal);
    let next;
    if (exists) {
      next = favorites.filter((f) => f.idMeal !== meal.idMeal);
      setFavorites(next);
      setMessage("Removed from favorites");
    } else {
      // store minimal info for list display
      next = [{ idMeal: meal.idMeal, strMeal: meal.strMeal, strMealThumb: meal.strMealThumb }, ...favorites];
      setFavorites(next);
      setMessage("Added to favorites");
    }
    setTimeout(()=>setMessage(""), 1600);
  };

  return (
    <div className="App">
      <header className="topbar">
        <h1>🍳 Recipe Finder</h1>
        <div className="actions">
          <button className="ghost" onClick={() => { setShowFavorites(!showFavorites); setMessage(""); }}>
            {showFavorites ? "Back" : `Favorites (${favorites.length})`}
          </button>
          <button onClick={fetchRandom}>Surprise me</button>
        </div>
      </header>

      <main>
        <SearchBar onSearch={fetchBySearch} />

        <div className="category-row">
          <button
            className={`pill ${selectedCategory === "" ? "active" : ""}`}
            onClick={() => { setSelectedCategory(""); setRecipes([]); setShowFavorites(false); }}
          >
            All
          </button>
          {categories.map((c) => (
            <button key={c.idCategory} className={`pill ${selectedCategory === c.strCategory ? "active" : ""}`}
              onClick={() => fetchByCategory(c.strCategory)}>
              {c.strCategory}
            </button>
          ))}
        </div>

        {message && <div className="msg">{message}</div>}

        {showFavorites ? (
          <section style={{marginTop:20}}>
            <h2>Your Favorites</h2>
            <RecipeList
              recipes={favorites}
              loading={false}
              onToggleFavorite={toggleFavorite}
              showAsFavoritesView
            />
          </section>
        ) : (
          <section style={{marginTop:20}}>
            <RecipeList
              recipes={recipes}
              loading={loading}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          </section>
        )}
      </main>

      <footer className="footer">
        <small>Data from TheMealDB • Beginner version</small>
      </footer>
    </div>
  );
}
