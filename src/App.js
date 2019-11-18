import React from 'react';

import { SearchProvider } from './components/SearchContext'
import Search from "./components/Search"

function App() {
  return (
      <SearchProvider>
        <Search/>
      </SearchProvider>
  );
}

export default App;
