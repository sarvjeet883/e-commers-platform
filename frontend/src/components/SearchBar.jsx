import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useCatalog } from "../context/CatalogContext";

// Flipkart-style live search with product suggestions
const SearchBar = ({ className = "" }) => {
  const { catalog: myProducts } = useCatalog();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const suggestions =
    query.trim().length > 0
      ? myProducts
          .filter(
            (p) =>
              p.name.toLowerCase().includes(query.toLowerCase()) ||
              p.category.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 6)
      : [];

  const goToProduct = (id) => {
    setQuery("");
    setIsFocused(false);
    navigate(`/product/${id}`);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search products…"
          className="w-full pl-9 pr-8 py-2 text-sm bg-gray-100/80 border border-transparent rounded-full focus:outline-none focus:bg-white focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {suggestions.map((p) => (
            <button
              key={p.id}
              onClick={() => goToProduct(p.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-emerald-50 transition-colors duration-150 text-left"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                <p className="text-xs text-gray-500">{p.category}</p>
              </div>
              <span className="text-sm font-semibold text-emerald-600 flex-shrink-0">
                {p.price}
              </span>
            </button>
          ))}
        </div>
      )}

      {isFocused && query.trim() && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3 text-sm text-gray-500 z-50">
          No products found for “{query}”
        </div>
      )}
    </div>
  );
};

export default SearchBar;
