import React, { useState, useEffect, useContext, useRef } from "react";
import { SearchContext }  from './SearchContext'

const GiphyVideo = ({ src, muted, playsInline }) => {
  console.log(src)
  const videoRef = useRef(null)
  const [classList, setClassList] = useState(["full-area"]);

  const [searchState, setSearchState] = useContext(SearchContext)

  const canPlayTrigger = e => {
    // document.querySelector('.text-to-life').html(TEXT)
  };
 
  const videoLoadedData = event => {
    videoRef.current.classList.add("visible");
    setSearchState({
      ...searchState,
      classList: `${classList} has-results`,
      loading: false
    });
  }

  useEffect(() => {
    videoRef.current.addEventListener("loadeddata", videoLoadedData);

    videoRef.current.play();

    return videoRef.current.removeEventListener("loadeddata", videoLoadedData)
  }, []);

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
      onCanPlay={canPlayTrigger}
      autoPlay={true}
      loop={true}
      src={src}
      muted
      playsInline
    ></video>
  );

};

export default GiphyVideo
