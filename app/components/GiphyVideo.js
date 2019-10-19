import { React, useState, useEffect } from 'react'

const GiphyVideo = React.forwardRef(({src, muted, playsInline}, ref) => {

  let [classList, setClassList] = useState(['full-area'])
  
  const canPlayTrigger = e => {
    // document.querySelector('.text-to-life').html(TEXT)  
  }

  return (
    <Video 
      className={classList.join(' ')} 
      onCanPlay={canPlayTrigger}
      autoPlay={'true'}
      loop={'true'}
      muted
      playsInline
      src
      ref
    >
    </Video>
  )  


  // displayGif, createVideo, after (searchResults.videoStack.length > 6) 
  // video.muted = true
  // video.playsInline = true
  
  video.addEventListener('loadeddata', event => {
    video.classList.add('visible')
    document.body.classList.add('has-results')
    setLoadingStatus(false)
  }) 
  
  video.play()
  
  
});

export default GiphyVideo