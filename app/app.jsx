import React from 'react';
import ReactDOM from 'react-dom';

import SearchProvider from './components/SearchContext'
import Search from "./components/Search";

ReactDOM.render(
  <SearchProvider>
    <Search/>
  </SearchProvider>
  , document.getElementById('main'));