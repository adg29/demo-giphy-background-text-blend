import { React, useState, useEffect } from "react";

const GiphyVideo = ({ src, muted, playsInline }) => {
  let videoRef = null
  let [classList, setClassList] = useState(["full-area"]);

  const canPlayTrigger = e => {
    // document.querySelector('.text-to-life').html(TEXT)
  };
  
  // displayGif, createVideo, after (searchResults.videoStack.length > 6)
  // video.muted = true
  // video.playsInline = true
  useEffect(() => {
    videoRef.addEventListener("loadeddata", event => {
      videoRef.classList.add("visible");
      document.body.classList.add("has-results");
      setLoadingStatus(false);
    });

    videoRef.play();

    return videoRef.removeEventListener("loadeddata")
  }, []);


  return (
    <Video
      ref={ref => videoRef = ref}
      className={classList.join(" ")}
      onCanPlay={canPlayTrigger}
      autoPlay={"true"}
      loop={"true"}
      muted
      playsInline
      src
      ref
    ></Video>
  );

};

export default GiphyVideo;
