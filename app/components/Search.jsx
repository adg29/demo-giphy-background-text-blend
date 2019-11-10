import { React, useState, useEffect } from "react";
import { useKeyPress } from "../hooks/useKeyPress";

import SearchHint from "./SearchHint";
import GiphyVideo from "./GiphyVideo";

import { textToLife as TEXT } from "../data/TextToLife";

import "../css/reset.css";
import "../css/styles.css";
import "../css/backgroundBlendText.css";
import "../css/transitions.css";
import "../css/responsive.css";

const API_KEY = "lQtrpRDYVbjAzpxqteWznJPbgk05p5P0";

const handleSearchInput = (event, searchState, setSearchState) => {
  const searchTerm = event.currentTarget.value;

  if (searchTerm.length > 0) {
    setSearchState({
      ...searchState,
      status: "input",
      term: searchTerm
    });
    fetchSearchResults(searchState, setSearchState);
  } else {
    setSearchState({
      ...searchState,
      status: "too-short"
    });
  }
};

const fetchSearchResults = (searchState, setSearchState) => {
  setSearchState({
    ...searchState,
    loading: true
  });

  searchGiphy(searchState, setSearchState)
    .then(json => {
      if (json.data.length > 0) {
        const videoSRC = selectRandomGif(json.data);
        displayGif(videoSRC);
        setSearchState({
          ...searchState,
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
};

const searchGiphy = (searchState, setSearchState) => {
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
        status: "connection-down",
        loading: false,
        ...searchState
      });
    });
};

const selectRandomGif = gifs => {
  const randomIndex = Math.floor(Math.random() * gifs.length);
  return gifs[randomIndex].images.original.mp4;
};

const displayGif = (src, setSearchState, searchResults, setSearchResults) => {
  setSearchResults({
    srcList: [...searchResults.srcList, src],
    ...searchResults
  });
  // const video = createVideo(src)
  // videosEl.style.display = 'grid'
  // videosEl.appendChild(video)

  // We don't want too many videos playing at once, as the performance degrades
  // (and new videos can't be played on iOS)
  if (searchResults.videoStack.length > 6) {
    /* We need to do the following: 
    1. firstly reset the video URL, and then reload it, to free up hardware 
    resources (per this post: https://bugs.webkit.org/show_bug.cgi?id=162366#c32)
    2. We don't want to then remove videos, because it changes the orientation of the video 
    stack (due to the nth-child CSS rule) - so we only look for videos where the src is not 
    blank (to make sure we don't select a video that we already disabled).*/

    const disableVideo = document.querySelector('video[src]:not([src=""])');
    disableVideo.setAttribute("src", "");
    disableVideo.load();
  }
};

// The only reason we have the form tag is to enable the Enter button to be renamed Search on iOS, so we block the form from taking its action when clicked.

const Search = ({}) => {
  let [searchState, setSearchState] = useState({
    loading: false,
    status: null,
    term: "",
    classList: []
  });

  let [searchResults, setSearchResults] = useState({
    videoStack: [],
    srcList: [],
    text: TEXT
  });

  const escapePress = useKeyPress("Escape");
  const enterPress = useKeyPress("Enter");

  const clearSearch = event => {
    setSearchState({
      status: "clear",
      ...searchState
    });
  };

  // document.body.classList.remove('has-results')
  // searchInputEl.style.display = 'inline-block'
  // searchInputEl.value = ''
  // searchInputEl.focus()
  useEffect(() => {
    if (searchState.status === "clear") {
      setSearchResults({
        videoStack: [],
        srcList: []
      });

      setSearchState({
        term: "",
        ...searchState
      });
    }
  }, searchState.status);

  useEffect(() => {
    this.refs.searchInputRef.blur();
    handleSearchInput(searchState, setSearchState);
  }, [enterPress]);

  useEffect(() => {
    setSearchState({
      status: "clear",
      ...searchState
    });
  }, [escapePress]);

  useEffect(() => {
    let classListAggregate = [];
    searchState.loading && classListAggregate.push("loading");
    searchState.status === "clear" && classListAggregate.push("has-results");

    setSearchState({
      classList: classListAggregate.join(" "),
      ...searchState
    });
  }, [searchState.loading, searchState.status]);

  return (
    <div className={searchState.classList}>
      <section>
        <p className="text-to-life">{searchResults.text}</p>
      </section>

      <div className="top grid">
        <h1 className="title full-area">Giphy Search</h1>
        <a className="search-clear full-area" onClick={clearSearch}>
          <img src="https://cdn.glitch.com/d958e7c2-3d1d-458e-8320-75c6b8c173d3%2Fclose.svg?1531225500180" />
        </a>
      </div>

      <div className="middle grid">
        <form className="full-area" onSubmit={e => e.preventDefault}>
          {searchState.status !== "search-more" && (
            <input
              className="search-input full-area"
              value={searchState.term}
              ref="searchInputRef"
              placeholder="Type something"
              type="search"
            />
          )}
        </form>
        <div className="videos grid full-area" onClick={handleSearchInput}>
          {searchResults.videoStack.map(v => {
            return v;
          })}
        </div>
      </div>

      <div className="indicators grid">
        <img
          className="spinner full-area"
          src="https://cdn.glitch.com/d958e7c2-3d1d-458e-8320-75c6b8c173d3%2Foval.svg?1531225500673"
        />

        <SearchHint
          screen="mobile"
          searchState={searchState}
          handleSearchInput={handleSearchInput}
        />
        <SearchHint screen="desktop" searchState={searchState} />
      </div>
    </div>
  );
};

export default Search;
