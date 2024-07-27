// src/components/ChapterSummary.js
import React from 'react';

function ChapterSummary({ chapterName, wordCount, currentIndex }) {
  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl rounded-lg overflow-hidden relative p-6 m-4">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Chapter: {chapterName}</h3>
      <p className="text-sm text-gray-600">Total words: {wordCount}</p>
      <p className="text-sm text-gray-600">Current progress: {currentIndex} / {wordCount}</p>
    </div>
  );
}

export default ChapterSummary;