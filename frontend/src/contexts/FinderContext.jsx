import React, { createContext, useContext, useState } from 'react';

const FinderContext = createContext(null);

export const FinderProvider = ({ children }) => {
  const [isFinderOpen, setIsFinderOpen] = useState(false);

  const value = {
    isFinderOpen,
    setIsFinderOpen,
  };

  return (
    <FinderContext.Provider value={value}>{children}</FinderContext.Provider>
  );
};

export const useFinder = () => {
  const context = useContext(FinderContext);
  if (!context) {
    throw new Error('useFinder must be used within a FinderProvider');
  }
  return context;
};
