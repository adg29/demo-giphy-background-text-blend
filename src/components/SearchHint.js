import React, { useState, useEffect } from "react";
import { useSearch } from './SearchContext'

const SearchHint = ({ screen }) => {
  const [searchState, setSearchState] = useSearch()
  const [hint, setHint] = useState("");

  const triggerSearchClick = (e) => {
    setSearchState({
      ...searchState,
      status: 'search-submit'
    })
  }

  useEffect(() => {
    // message, searchTerm = ''
    if (searchState.status === "no-results") {
      setHint(`No results for ${searchState.term}`);
    } else if (searchState.status === "search-more") {
      setHint(`Tap to search for more ${searchState.term}`);
    } else if (searchState.status === "clear") {
      setHint(``);
    } else if (searchState.status === "connection-down") {
      setHint(`Sorry, we can't seem to connect to Giphy. Try later!`);
    } else if (searchState.status === "too-short") {
      setHint(`Can't search for nothing!`);
    }
  }, [searchState.status, searchState.term]);

  return (
    <span
      className={`search-hint full-area ${screen}`}
      onClick={triggerSearchClick}
    >
      {hint}
    </span>
  );
};

export default SearchHint;
