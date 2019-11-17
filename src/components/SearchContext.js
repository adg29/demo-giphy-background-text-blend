import React, { useReducer , useContext } from "react";

const SearchContext = React.createContext();

const searchReducer = (searchState, action) => {
  switch (action.type) {
    case 'CLEAR': {
      return {
        ...searchState,
        status: "clear",
        loading: false,
        srcList: [],
        term: ""
      }
    }
    case 'LOADING': {
      return {
        ...searchState,
        loading: true
      }
    }
    case 'CONNECTION_DOWN': {
      return {
        ...searchState,
        status: "connection-down",
        loading: false
      }
    }
    case 'RESULT_SET': {
      return {
        ...searchState,
        srcList: [...searchState.srcList, action.payload.result],
        status: "search-more"
      }
    }
    case 'RESULT_NONE': {
      return {
        ...searchState,
        status: "no-results",
        loading: false
      }
    }
    case 'TERM_SET': {
      return {
        ...searchState,
        term: action.payload.term
      }
    }
    case 'TERM_SUBMIT': {
      return {
        ...searchState,
        status: "search-submit"
      }
    }
    case 'TERM_TOO_SHORT': {
      return {
        ...searchState,
        status: "too-short"
      }
    }
    default: {
      throw new Error(`Unsupported action type: ${action.type}`)
    }
  }
}

const useSearch = () => {
  const context = useContext(SearchContext)
  
  if(!context) {
    throw new Error(`useSearch must be used within a SearchProvider`)
  }

  const [state, dispatch] = context

  return {
    state,
    dispatch
  }
}

const SearchProvider = props => {
  const [state, dispatch] = useReducer(searchReducer, {
    loading: false,
    status: null,
    term: "",
    result: null,
    classList: [],
    videoStack: [],
    srcList: []
  })

  const value = React.useMemo(() => [state, dispatch], [state])
  return ( 
    <SearchContext.Provider value={value} {...props} />
  );
};

export { useSearch, SearchProvider };
