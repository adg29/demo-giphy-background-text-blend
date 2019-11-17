import React, { useState, useContext } from "react";

const SearchContext = React.createContext();

const useSearch = () => {
  const context = useContext(SearchContext)
  
  if(!context) {
    throw new Error(`useSearch must be used within a SearchProvider`)
  }

  return context
}

const SearchProvider = props => {
  const [state, setState] = useState({
    loading: false,
    status: null,
    term: "",
    result: null,
    classList: [],
    videoStack: [],
    srcList: []
  })

  const value = React.useMemo(() => [state, setState], [state])
  return ( 
    <SearchContext.Provider value={value} {...props} />
  );
};

export { useSearch, SearchProvider };
