import React, { useState } from "react";

const SearchContext = React.createContext([{}, () => {}]);

const SearchProvider = props => {
  const [state, setState] = useState({
    loading: false,
    status: null,
    term: "",
    classList: []    
  })
  return ( 
    <SearchContext.Provider value={[state, setState]}>
      {props.children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchProvider };
