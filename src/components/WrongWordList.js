import React from 'react';

function WrongWordList({ wrongWords }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
        Wrong Words
      </h2>
      <ul className="mt-5 divide-y divide-gray-200">
        {wrongWords.map((word, index) => (
          <li key={index} className="py-4">
            <div className="flex space-x-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{word.word}</h3>
                  <p className="text-sm text-gray-500">Chapter: {word.chapter}</p>
                </div>
                <p className="text-sm text-gray-500">{word.meaning}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WrongWordList;