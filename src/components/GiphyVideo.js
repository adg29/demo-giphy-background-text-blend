import React, { useState, useEffect, useRef } from "react";
import { useSearch }  from './SearchContext'

const GiphyVideo = ({ src, resultIndex }) => {
  const videoRef = useRef()
  const [classList, setClassList] = useState(["full-area"]);

  const {searchState, dispatch} = useSearch()

  const videoLoadedData = event => {
    setClassList([...classList, "visible"]);
    dispatch({type: 'LOADING_DONE'})
  }

  useEffect(() => {
    if (resultIndex < searchState.srcList.length - 6) {
      videoRef.current.src = ''
      videoRef.current.load()
    }
  }, [searchState.srcList, resultIndex])

  return (
    <video
      ref={videoRef}
      className={classList.join(" ")}
      autoPlay={true}
      loop={true}
      src={src}
      onLoadedData={videoLoadedData}
      muted={true}
      playsInline={true}
    ></video>
  );

};

export default GiphyVideo
