import React from 'react';
import { FinderProvider } from '../../contexts/FinderContext';
import GlobalFinder from './GlobalFinder';

const Layout = ({ children }) => {
  return (
    <FinderProvider>
      {/* Main content area where the search will look for text */}
      <main id='main-content'>{children}</main>
      <GlobalFinder />
    </FinderProvider>
  );
};

export default Layout;
