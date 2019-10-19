const updateSearchHint = (message, searchTerm = '') => {
  if (message === "no-results") { 
    return `No results for ${searchTerm}`
  } else if (message === "search-more") {
    return `Tap to search for more ${searchTerm}`
  } else if (message === "clear") { 
    return ''
  } else if (message === "connection-down") {
    return `Sorry, we can't seem to connect to Giphy. Try later!`
  } else if (message === "too-short") {
    return `Can't search for nothing!`
  }
}
      

const SearchHint = ({screen, message, searchTerm}) => {
  return (
    <span className={`search-hint full-area ${screen}`}>
      {updateSearchHint(message)}
    </span>
  )
}