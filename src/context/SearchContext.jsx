import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  return context;
}

SearchProvider.propTypes = {
  children: PropTypes.node,
};
