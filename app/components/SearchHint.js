import { useState, useEffect } from 'react'

const SearchHint = ({screen, searchState, handleSearchInput}) => {

  const [hint, setHint] = useState('')
  
  useEffect(() => {
    // message, searchTerm = ''
    if (searchState.status === "no-results") { 
      setHint(`No results for ${searchState.term}`)
    } else if (searchState.status === "search-more") {
      setHint(`Tap to search for more ${searchState.term}`)
    } else if (searchState.status === "clear") { 
      setHint(`''`)
    } else if (searchState.status === "connection-down") {
      setHint(`Sorry, we can't seem to connect to Giphy. Try later!`)
    } else if (searchState.status === "too-short") {
      setHint(`Can't search for nothing!`)
    }
  }, [searchState.status])

  
  return (
    <span className={`search-hint full-area ${screen}`} onClick={screen === 'mobile' ? handleSearchInput : () => {}}>
      {hint}
    </span>
  )
}

export default SearchHint