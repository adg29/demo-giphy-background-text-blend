import React, { useState, useEffect, useContext, useRef } from "react";
import { SearchContext }  from './SearchContext'

const GiphyVideo = ({ src, muted, playsInline }) => {
  const videoRef = useRef()
  const [classList, setClassList] = useState(["full-area"]);

  const [searchState, setSearchState] = useContext(SearchContext)

  const videoLoadedData = event => {
    console.log('videoLoaded')
    setClassList([...classList, "visible"]);
    setSearchState({
      ...searchState,
      classList: [...searchState.classList, 'has-results'],
      loading: false
    });
  }

  useEffect(() => {
    if (searchState.srcList.length > 6) {
      videoRef.current.setAttribute("src", "");
      videoRef.current.load();
    }
  }, [searchState.srcList]);


  return (
    <video
      ref={videoRef}
      className={classList.join(" ")}
      autoPlay={true}
      loop={true}
      src={src}
      onLoadedData={videoLoadedData}
      muted
      playsInline
    ></video>
  );

};

export default GiphyVideo
