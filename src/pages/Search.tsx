// pages/Search.tsx
import { useLocation } from "react-router-dom";

export default function Search() {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") ?? "";

  return (
    <div>
      <h2>Search Results</h2>

      {query ? (
        <p>Searching for: <strong>{query}</strong></p>
      ) : (
        <p>Start typing above to search for books.</p>
      )}
    </div>
  );
}