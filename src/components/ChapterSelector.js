// src/components/ChapterSelector.js
import React from 'react';

function ChapterSelector({ chapters, selectedChapter, onChapterChange }) {
  return (
    <div className="mb-4">
      <label htmlFor="chapter-select" className="block text-sm font-medium text-gray-700 mb-1">
        Select Chapter:
      </label>
      <select
        id="chapter-select"
        value={selectedChapter}
        onChange={(e) => onChapterChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {chapters.map((chapter) => (
          <option key={chapter} value={chapter}>
            {chapter === 'all' ? 'All Chapters' : `Chapter ${chapter}`}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ChapterSelector;