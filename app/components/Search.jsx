import { React, useState } from 'react'
import SearchHint from './SearchHint'
import "../css/reset.css"
import "../css/styles.css"
import "../css/backgroundBlendText.css"
import "../css/transitions.css"
import "../css/responsive.css"


const API_KEY = 'lQtrpRDYVbjAzpxqteWznJPbgk05p5P0'

const TEXT = 'LOREM' 
const canPlayTriggerTextIn = (e) => {
  document.querySelector('.text-to-life').html(TEXT)  
}

const handleSearchInput = (event, setSearchStatus, setMessage, setSearchTerm) => {
  const searchTerm = event.currentTarget.value
  
  if (searchTerm.length > 0) {
    setSearchStatus('results')
    setSearchTerm(searchTerm)
    fetchSearchResults(searchTerm, setMessage)  
  } else {
    setMessage('too-short')
  }
}

const fetchSearchResults = (searchTerm, setMessage) => {
  showLoading(true)
  
  searchGiphy(searchTerm)
  .then(json => {
    if (json.data.length > 0) {
      const videoSRC = selectRandomGif(json.data)
      displayGif(videoSRC)
      setMessage('search-more')
    } else {
      throw new Error();
    }
  })
  .catch(error => {
    setMessage('no-results')
    showLoading(false)
  });
}

const searchGiphy = (searchTerm, setMessage) => {  
  return fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=PG-13&lang=en`)
  .then(response => {
    if (response.status === 200) {
      return response.json()
    } else {
      throw new Error(response);
    }
  })
  .catch(error => {
    setMessage('connection-down')
    showLoading(false)
  });
};

const selectRandomGif = gifs => {
  const randomIndex = Math.floor(Math.random() * gifs.length)
  return gifs[randomIndex].images.original.mp4
}


const displayGif = src => {
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
    showLoading(false)
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

// Event handlers for deciding to run a search query
document.addEventListener('keyup', event => {
  if (event.key === 'Enter') {
    searchInputEl.blur()
    handleSearchInput(event)
  }
});

// Event handlers for rerunning a search query
videosEl.addEventListener('click', handleSearchInput);
searchHintMobileEl.addEventListener('click', handleSearchInput);

clearSearchEl.addEventListener('click', clearSearch);

document.addEventListener('keyup', event => {
  if(event.key === 'Escape') {
    clearSearch();
  }
});

// The only reason we have the form tag is to enable the Enter button to be renamed Search on iOS, so we block the form from taking its action when clicked. 
formEl.addEventListener('submit', event => { 
  event.preventDefault()
});
      


/* takes an array prop 'items' and returns a <ul> element 
   with each item as <li> elements. Also demos importing styles. */
const Search = ({}) => {
  let [searchStatus, setSearchStatus] = useState(null)
  let [message, setMessage] = useState()
  let [searchTerm, setSearchTerm] = useState('')
  let [loadingStatus, setLoadingStatus] = useState(true)
  
  return (
  
  <div className={loadingStatus && 'loading'}>
    <section>
      <p class="text-to-life"></p>
    </section>

    <div class="top grid">
      <h1 class="title full-area">Jiffy GIF Search</h1>
      <a class="search-clear full-area">
        <img src="https://cdn.glitch.com/d958e7c2-3d1d-458e-8320-75c6b8c173d3%2Fclose.svg?1531225500180" />
      </a>
    </div>

    <div class="middle grid">
      <form class="full-area" action="">
        {searchStatus !== 'results' && (
          <input
          class="search-input full-area"
          placeholder="Type something"
          type="search"
          />
        )}
      </form>
      <div class="videos grid full-area"></div>
    </div>

    <div class="indicators grid">
      <img
        class="spinner full-area"
        src="https://cdn.glitch.com/d958e7c2-3d1d-458e-8320-75c6b8c173d3%2Foval.svg?1531225500673"
      />

      
      <SearchHint screen='mobile' message={message} searchTerm={searchTerm}/>
      <SearchHint screen='desktop' message={message} searchTerm={searchTerm}/>
    </div>
  </div>
  

  );
}

export default Search;
