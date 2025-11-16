import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode preference on startup
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setDarkMode(true);
  }, []);

  // Save dark mode preference whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const searchRecipes = async () => {
    if (!query) return;

    const res = await axios.get(
      `https://api.edamam.com/search?q=${query}&app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY`
    );

    setRecipes(res.data.hits);
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header className="header">
        <h1>🍽 Recipe Finder</h1>

        <button className="dark-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="search-btn" onClick={searchRecipes}>
          Search
        </button>
      </div>

      <div className="recipes">
        {recipes.map((item, index) => (
          <div className="recipe-card" key={index}>
            <img src={item.recipe.image} alt="recipe" />
            <h3>{item.recipe.label}</h3>
            <p>Calories: {Math.round(item.recipe.calories)}</p>
            <a className="view-btn" href={item.recipe.url} target="_blank">
              View Recipe
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
