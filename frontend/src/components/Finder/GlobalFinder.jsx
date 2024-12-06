import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ArrowUp, ArrowDown, X } from 'lucide-react';
import _ from 'lodash';
import { useFinder } from '../../contexts/FinderContext';

const GlobalFinder = () => {
  const { isFinderOpen, setIsFinderOpen } = useFinder();
  const [searchText, setSearchText] = useState('');
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const inputRef = useRef(null);

  // Function to remove all highlights
  const removeHighlights = useCallback(() => {
    const marks = document.querySelectorAll('mark.text-finder-highlight');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        const text = document.createTextNode(mark.textContent);
        parent.replaceChild(text, mark);
        parent.normalize();
      }
    });
  }, []);

  // Function to get all text nodes recursively
  const getTextNodes = node => {
    const textNodes = [];

    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      textNodes.push(node);
    } else {
      const children = Array.from(node.childNodes);
      children.forEach(child => {
        if (
          child.nodeName !== 'SCRIPT' &&
          child.nodeName !== 'STYLE' &&
          child.nodeName !== 'MARK'
        ) {
          textNodes.push(...getTextNodes(child));
        }
      });
    }

    return textNodes;
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    _.debounce(searchTerm => {
      if (!searchTerm || searchTerm.length < 1) {
        removeHighlights();
        setMatches([]);
        setCurrentMatchIndex(0);
        return;
      }

      // Search in the main content area of the page
      const mainContent = document.getElementById('main-content');
      if (!mainContent) return;

      removeHighlights();
      const newMatches = [];
      const searchTermLower = searchTerm.toLowerCase();
      const textNodes = getTextNodes(mainContent);

      textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const indices = [];
        let startIndex = 0;

        while (true) {
          const index = text.toLowerCase().indexOf(searchTermLower, startIndex);
          if (index === -1) break;

          indices.push(index);
          startIndex = index + 1;
        }

        // Process all found indices in reverse order
        for (let i = indices.length - 1; i >= 0; i--) {
          const index = indices[i];
          const range = document.createRange();
          range.setStart(textNode, index);
          range.setEnd(textNode, index + searchTerm.length);

          const mark = document.createElement('mark');
          mark.className = 'text-finder-highlight bg-emerald-100';

          try {
            range.surroundContents(mark);
            newMatches.unshift(mark);
          } catch (e) {
            console.error('Failed to highlight match:', e);
          }
        }
      });

      setMatches(newMatches);
      if (newMatches.length > 0) {
        setCurrentMatchIndex(0);
        newMatches[0].classList.add('bg-yellow-400');
        newMatches[0].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }
    }, 300),
    [removeHighlights]
  );

  // Handle search input changes
  const handleSearchChange = e => {
    const newSearchText = e.target.value;
    setSearchText(newSearchText);
    debouncedSearch(newSearchText);
  };

  // Navigate between matches
  const navigateMatches = useCallback(
    direction => {
      if (matches.length === 0) return;

      matches[currentMatchIndex].classList.remove('bg-yellow-400');
      let newIndex;

      if (direction === 'next') {
        newIndex = (currentMatchIndex + 1) % matches.length;
      } else {
        newIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
      }

      setCurrentMatchIndex(newIndex);
      matches[newIndex].classList.add('bg-yellow-400');
      matches[newIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    },
    [matches, currentMatchIndex]
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        setIsFinderOpen(true);
        inputRef.current?.focus();
      } else if (e.key === 'Escape') {
        setIsFinderOpen(false);
        removeHighlights();
        setSearchText('');
      } else if (e.key === 'Enter' && matches.length > 0) {
        e.preventDefault();
        if (e.shiftKey) {
          navigateMatches('prev');
        } else {
          navigateMatches('next');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigateMatches, removeHighlights, matches.length, setIsFinderOpen]);

  // Clean up highlights when component unmounts
  useEffect(() => {
    return () => removeHighlights();
  }, [removeHighlights]);

  // Clean up highlights when changing pages
  useEffect(() => {
    return () => {
      removeHighlights();
      setSearchText('');
      setMatches([]);
      setCurrentMatchIndex(0);
    };
  }, [removeHighlights, window.location.pathname]);

  return (
    <>
      <button
        onClick={() => setIsFinderOpen(true)}
        className='fixed top-20 md:top-28 right-4  md:right-14  p-2 bg-white border rounded-md shadow-md hover:bg-gray-50 z-50'
        title='Open finder (Ctrl+F)'
      >
        <Search size={20} />
      </button>

      {isFinderOpen && (
        <div className='fixed top-4 right-4 flex items-center gap-2 p-2 bg-white border rounded-md shadow-md z-50'>
          <Search size={16} className='text-gray-400' />
          <input
            ref={inputRef}
            type='text'
            value={searchText}
            onChange={handleSearchChange}
            placeholder='Find in page...'
            className='w-48 outline-none'
            autoFocus
          />
          {matches.length > 0 && (
            <span className='text-sm text-gray-500'>
              {currentMatchIndex + 1}/{matches.length}
            </span>
          )}
          <div className='flex items-center gap-1'>
            <button
              onClick={() => navigateMatches('prev')}
              className='p-1 hover:bg-gray-100 rounded'
              title='Previous match (Shift+Enter)'
              disabled={matches.length === 0}
            >
              <ArrowUp
                size={16}
                className={matches.length === 0 ? 'text-gray-300' : ''}
              />
            </button>
            <button
              onClick={() => navigateMatches('next')}
              className='p-1 hover:bg-gray-100 rounded'
              title='Next match (Enter)'
              disabled={matches.length === 0}
            >
              <ArrowDown
                size={16}
                className={matches.length === 0 ? 'text-gray-300' : ''}
              />
            </button>
            <button
              onClick={() => {
                setIsFinderOpen(false);
                removeHighlights();
                setSearchText('');
              }}
              className='p-1 hover:bg-gray-100 rounded'
              title='Close finder (Esc)'
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalFinder;
