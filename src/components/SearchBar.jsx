import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const val = q.trim();
    if (!val) return;
    onSearch(val);
  };

  return (
    <form className="search-bar" onSubmit={submit}>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search recipes (e.g. chicken, curry, cake)..."
        aria-label="Search"
      />
      <button type="submit">Search</button>
    </form>
  );
}
