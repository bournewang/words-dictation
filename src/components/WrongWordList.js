// src/components/WrongWordList.js
import React, { useState, useMemo } from 'react';
import ChapterSelector from './ChapterSelector';
import { Link } from 'react-router-dom';

function WrongWordList({ wrongWords }) {
    const [selectedChapter, setSelectedChapter] = useState('all');
    const [selectedWord, setSelectedWord] = useState(null);

    const chapters = useMemo(() => ['all', ...Object.keys(wrongWords)], [wrongWords]);

    const filteredWrongWords = useMemo(() => {
        if (selectedChapter === 'all') {
            return wrongWords;
        }
        return { [selectedChapter]: wrongWords[selectedChapter] || [] };
    }, [wrongWords, selectedChapter]);

    const totalWrongWords = Object.values(filteredWrongWords).flat().length;

    if (Object.keys(wrongWords).length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-6">
                    Wrong Words
                </h2>
                <p className="text-gray-500">Your wrong words list is empty. Great job! Keep practicing to maintain your skills.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="fixed top-20 right-4 w-64">
                <ChapterSelector chapters={chapters} selectedChapter={null} onChapterChange={setSelectedChapter} />
            </div>
            <div className="mr-72">

                <div className="text-right">
                    <Link
                        to="/practice-wrong-words"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Practice Wrong Words
                    </Link>
                </div>

                {Object.entries(filteredWrongWords).map(([chapter, words]) => (
                    <div key={chapter} className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Chapter: {chapter}</h3>
                        {words.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {words.map((word, index) => (
                                    <p className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        {word.word}, {word.meaning}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No wrong words for this chapter.</p>
                        )}
                    </div>
                ))}

                {selectedWord && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setSelectedWord(null)}>
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
                            <div className="mt-3 text-center">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">{selectedWord.word}</h3>
                                <div className="mt-2 px-7 py-3">
                                    <p className="text-sm text-gray-500">
                                        Meaning: {selectedWord.meaning}
                                    </p>
                                </div>
                                <div className="items-center px-4 py-3">
                                    <button
                                        id="ok-btn"
                                        className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                        onClick={() => setSelectedWord(null)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WrongWordList;