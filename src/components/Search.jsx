import React, { useEffect, useRef } from "react";
import useKeyPress from "../hooks/useKeyPress";

import SearchHint from "./SearchHint";
import GiphyVideo from "./GiphyVideo";

import searchGiphy from "./FetchApi"

import "../css/reset.css";
import "../css/styles.css";
import "../css/backgroundBlendText.css";
import "../css/transitions.css";
import "../css/responsive.css";

import { useSearch } from './SearchContext'


const selectRandomGif = gifs => {
  const randomIndex = Math.floor(Math.random() * gifs.length);
  return gifs[randomIndex].images.original.mp4;
}

const Search = () => {
  const {searchState, dispatch} = useSearch()

  let searchInputRef = useRef()

  const escapePress = useKeyPress("Escape");
  const enterPress = useKeyPress("Enter");

  const clearSearch = React.useCallback(event => {
    searchInputRef.current.style.display = 'inline-block'
    searchInputRef.current.focus()
    dispatch({type: 'CLEAR'})
  }, [dispatch]);


  useEffect(() => {
    if (searchState.status === 'search-submit') {
      if (searchState.term.length > 0) {
        dispatch({type: 'LOADING'})
        let giphyResponse = null
        try {
          giphyResponse = searchGiphy(searchState.term)
        } catch (error) {
          dispatch({ type: 'CONNECTION_DOWN' });
        }
        
        giphyResponse
          .then(json => {
            if (json.data.length > 0) {
              let searchResultSrc = selectRandomGif(json.data);
              dispatch({type: 'RESULT_SET', payload: {
                result: searchResultSrc
              }})
            } else {
              throw new Error();
            }
          })
          .catch(error => {
            dispatch({type: 'NO_RESULT'});
          })
      } else {
        dispatch({type: 'TERM_TOO_SHORT'});
      }
    }
  }, [searchState.status, searchState.term, dispatch]);

  useEffect(() => {
    if (enterPress) {
      searchInputRef.current.blur()
      dispatch({type: 'TERM_SUBMIT'})
    }
  }, [enterPress, dispatch]);

  useEffect(() => {
    clearSearch()
  }, [escapePress, clearSearch]);

  return (
    <div className={searchState.srcList.length ? 'has-results': ''}>
      {/* <section>
        <p className="text-to-life">{TEXT}</p>
      </section> */}

      <div className="top grid">
        <h1 className="title full-area">Giphy Search</h1>
        <a href="#clear" className="search-clear full-area" onClick={clearSearch}>
          <img 
            alt="Clear results"
            src="../assets/close.svg"
          />
        </a>
      </div>

      <div className="middle grid">
        <form className="full-area" onSubmit={e => e.preventDefault()}>      
        <input
          style={{display: searchState.status !== "search-more" ? 'inline-block': 'none'}}
          className="search-input full-area"
          ref={searchInputRef}
          placeholder="Type something"
          value={searchState.term}
          onChange={e => dispatch({type: 'TERM_SET', payload: {
            term: e.currentTarget.value
          }})}
          type="search"
        />
        </form>
        <div className="videos grid full-area" style={{display: searchState.srcList.length ? 'grid' : ''}}>
          {searchState.srcList.map((giphySrc, i) => (
            <GiphyVideo 
              src={giphySrc}
              resultIndex={i}
              key={i}
            />
          ))}
        </div>
      </div>

      <div className="indicators grid">
        <img
          alt="Loading results..."
          className={`spinner full-area ${searchState.loading && ('visible')}`}
          src="../assets/oval.svg"
        />
        <SearchHint screen="mobile" />
        <SearchHint screen="desktop"/>
      </div>
    </div>
  );
};

export default Search
