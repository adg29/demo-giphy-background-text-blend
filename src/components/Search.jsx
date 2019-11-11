import React, { useEffect, useContext, useRef } from "react";
import useKeyPress from "../hooks/useKeyPress";

import SearchHint from "./SearchHint";
import GiphyVideo from "./GiphyVideo";

import TEXT from "../data/TextToLife";

import "../css/reset.css";
import "../css/styles.css";
import "../css/backgroundBlendText.css";
import "../css/transitions.css";
import "../css/responsive.css";

import { SearchContext } from './SearchContext'

const API_KEY = "lQtrpRDYVbjAzpxqteWznJPbgk05p5P0";

const selectRandomGif = gifs => {
  const randomIndex = Math.floor(Math.random() * gifs.length);
  return gifs[randomIndex].images.original.mp4;
};

const Search = ({}) => {
  const [searchState, setSearchState] = useContext(SearchContext)

  let searchInputRef = useRef()

  const escapePress = useKeyPress("Escape");
  const enterPress = useKeyPress("Enter");

  useEffect(() => {
    // videosEl.style.display = 'grid'
  }, [searchState.srcList])

  const clearSearch = event => {
    setSearchState({
      ...searchState,
      status: "clear",
      srcList: [],
      term: ""
    });
  };

  const searchGiphy = () => {
    return fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchState.term}&limit=50&offset=0&rating=PG-13&lang=en`
    )
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(response);
        }
      })
      .catch(error => {
        setSearchState({
          ...searchState,
          status: "connection-down",
          loading: false
        });
      });
  };

  useEffect(() => {
    if (searchState.status === "clear") {
      setSearchState({
        ...searchState,
        srcList: [],
        term: ""
      });
      searchInputRef.current.style.display = 'inline-block'
      searchInputRef.current.focus();
    } else if (searchState.status === 'search-submit') {
      if (searchState.term.length > 0) {
        setSearchState({
          ...searchState,
          loading: true
        });

        searchGiphy()
          .then(json => {
            if (json.data.length > 0) {
              let searchResultSrc = selectRandomGif(json.data);
              setSearchState({
                ...searchState,
                srcList: [...searchState.srcList, searchResultSrc],
                result: searchResultSrc,
                status: "search-more"
              });
            } else {
              throw new Error();
            }
          })
          .catch(error => {
            setSearchState({
              ...searchState,
              status: "no-results",
              loading: false
            });
          });
      } else {
        setSearchState({
          ...searchState,
          status: "too-short"
        });
      }
    }
  }, [searchState.status]);

  useEffect(() => {
    searchInputRef.current.blur();
    setSearchState({
      ...searchState,
      status: "search-submit"
    });
  }, [enterPress]);

  useEffect(() => {
    setSearchState({
      status: "clear",
      ...searchState
    });
  }, [escapePress]);

  return (
    <div className={searchState.srcList && 'has-results'}>
      {/* <section>
        <p className="text-to-life">{TEXT}</p>
      </section> */}

      <div className="top grid">
        <h1 className="title full-area">Giphy Search</h1>
        <a className="search-clear full-area" onClick={clearSearch}>
          <img 
            alt="Clear results"
            src="https://cdn.glitch.com/d958e7c2-3d1d-458e-8320-75c6b8c173d3%2Fclose.svg?1531225500180" 
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
          onChange={e => setSearchState({
            ...searchState,
            term: e.currentTarget.value
          })}
          type="search"
        />
        </form>
        <div className="videos grid full-area" style={{display: searchState.srcList.length ? 'grid' : ''}}>
          {searchState.srcList.map((src, i) => (
            <GiphyVideo 
              src={i > 6 && i === 0 ? '' : src}
              key={i}
            />
          ))}
        </div>
      </div>

      <div className="indicators grid">
        <img
          alt="Loading results..."
          className="spinner full-area"
          src="https://cdn.glitch.com/d958e7c2-3d1d-458e-8320-75c6b8c173d3%2Foval.svg?1531225500673"
        />

        <SearchHint
          screen="mobile"
        />
        <SearchHint screen="desktop"/>
      </div>
    </div>
  );
};

export default Search
