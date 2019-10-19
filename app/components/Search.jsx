import { React, useState } from 'react'
import { useKeyPress } from './hooks/useKeyPress'
import SearchHint from './SearchHint'
import {textToLife as TEXT} from 'data/TextToLife' 

import "../css/reset.css"
import "../css/styles.css"
import "../css/backgroundBlendText.css"
import "../css/transitions.css"
import "../css/responsive.css"


const API_KEY = 'lQtrpRDYVbjAzpxqteWznJPbgk05p5P0'

const canPlayTriggerTextIn = e => {
  document.querySelector('.text-to-life').html(TEXT)  
}

const handleSearchInput = (searchState, setSearchState) => {
  const searchTerm = searchState.term
  
  if (searchTerm.length > 0) {
    setSearchState({
      status: 'input',
      term: searchTerm,
      ...searchState
    })
    fetchSearchResults(searchState, setSearchState)  
  } else {
    setSearchState({
      message: 'too-short',
      ...searchState
    })  
  }
}

const fetchSearchResults = (searchState, setSearchState) => {
  setSearchState({
    loading: true,
    ...searchState
  })  

  searchGiphy(searchState, setSearchState)
  .then(json => {
    if (json.data.length > 0) {
      const videoSRC = selectRandomGif(json.data)
      displayGif(videoSRC)
      setSearchState({
        message: 'search-more',
        ...searchState
      })  
    
    } else {
      throw new Error();
    }
  })
  .catch(error => {
    setSearchState({
      message: 'no-results',
      loading: false,
      ...searchState
    })  

  });
}

const searchGiphy = (searchState, setSearchState) => {  
  return fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchState.term}&limit=50&offset=0&rating=PG-13&lang=en`)
  .then(response => {
    if (response.status === 200) {
      return response.json()
    } else {
      throw new Error(response);
    }
  })
  .catch(error => {
    setSearchState({
      message: 'connection-down',
      loading: false,
      ...searchState
    })
  });
};

const selectRandomGif = gifs => {
  const randomIndex = Math.floor(Math.random() * gifs.length)
  return gifs[randomIndex].images.original.mp4
}


const displayGif = (src, setLoadingStatus) => {
  const video = createVideo(src)
  videosEl.style.display = 'grid'
  videosEl.appendChild(video)
  videosEl.addEventListener('canplay', canPlayTriggerTextIn)
  
  // We don't want too many videos playing at once, as the performance degrades 
  // (and new videos can't be played on iOS)
  if (document.querySelectorAll('video').length > 6) {
    /* We need to do the following: 
    1. firstly reset the video URL, and then reload it, to free up hardware 
    resources (per this post: https://bugs.webkit.org/show_bug.cgi?id=162366#c32)
    2. We don't want to then remove videos, because it changes the orientation of the video 
    stack (due to the nth-child CSS rule) - so we only look for videos where the src is not 
    blank (to make sure we don't select a video that we already disabled).*/
    
    const disableVideo =  document.querySelector('video[src]:not([src=""])');
    disableVideo.setAttribute('src','')
    disableVideo.load()
  }
  
  video.addEventListener('loadeddata', event => {
    video.classList.add('visible')
    document.body.classList.add('has-results')
    setLoadingStatus(false)
  }) 
  
  video.muted = true
  video.playsInline = true
  video.play()
}

const createVideo = src => {
  const videoEl = document.createElement('video')

  videoEl.src = src
  videoEl.autoplay = true
  videoEl.loop = true
  videoEl.classList.add('full-area')
  
  return videoEl
}

const clearSearch = event => {
  document.body.classList.remove('has-results')
  
  videosEl.innerHTML = ''
  updateSearchHint('clear')
  searchInputEl.style.display = 'inline-block'
  searchInputEl.value = ''
  
  searchInputEl.focus()
}



// The only reason we have the form tag is to enable the Enter button to be renamed Search on iOS, so we block the form from taking its action when clicked. 

const Search = ({}) => {
  let [searchState, setSearchState] = useState({
    status: null,
    message: null,
    term: '',
    loading: true
  })
  
  const escapePress = useKeyPress('Escape')
  const enterPress = useKeyPress('Enter')
  
  if (escapePress) {
    clearSearch()
  }
  
  if (enterPress) {
    searchInputEl.blur()
    handleSearchInput(searchState, setSearchState)
  }
  
  return (
  
  <div className={searchState.loadingStatus && 'loading'}>
    <section>
      <p class="text-to-life"></p>
    </section>

    <div class="top grid">
      <h1 class="title full-area">Jiffy GIF Search</h1>
      <a class="search-clear full-area" onClick={clearSearch}>
        <img src="https://cdn.glitch.com/d958e7c2-3d1d-458e-8320-75c6b8c173d3%2Fclose.svg?1531225500180" />
      </a>
    </div>

    <div class="middle grid">
      <form class="full-area" onSubmit={e => e.preventDefault}>
        {searchState.status !== 'results' && (
          <input
          class="search-input full-area"
          placeholder="Type something"
          type="search"
          />
        )}
      </form>
      <div class="videos grid full-area" onClick={handleSearchInput}></div>
    </div>

    <div class="indicators grid">
      <img
        class="spinner full-area"
        src="https://cdn.glitch.com/d958e7c2-3d1d-458e-8320-75c6b8c173d3%2Foval.svg?1531225500673"
      />

      
      <SearchHint screen='mobile' searchState={searchState} handleSearchInput={handleSearchInput}/>
      <SearchHint screen='desktop' searchState={searchState}/>
    </div>
  </div>
  

  );
}

export default Search;
