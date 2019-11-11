import { React, useState, useEffect, useContext } from "react";
import { SearchContext }  from './SearchContext'

const GiphyVideo = ({ src, muted, playsInline }) => {
  const videoRef = null
  const [classList, setClassList] = useState(["full-area"]);

  const [searchState, setSearchState] = useContext(SearchContext)

  const canPlayTrigger = e => {
    // document.querySelector('.text-to-life').html(TEXT)
  };
  
  useEffect(() => {
    videoRef.addEventListener("loadeddata", event => {
      videoRef.classList.add("visible");
      setSearchState({
        classList: `${classList} has-results`,
        loading: false,
        ...searchState
      });
    });

    videoRef.play();

    return videoRef.removeEventListener("loadeddata")
  }, []);

  useEffect(() => {
    if (searchState.videoStack.length > 6) {
      videoRef.setAttribute("src", "");
      videoRef.load();
    }
  }, [searchState.videoStack]);


  return (
    <video
      ref={ref => videoRef = ref}
      className={classList.join(" ")}
      onCanPlay={canPlayTrigger}
      autoPlay={"true"}
      loop={"true"}
      muted
      playsInline
      src
      ref
    ></video>
  );

};

export default GiphyVideo;
