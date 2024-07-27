// src/components/WrongWordList.js
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ChapterSelector from './ChapterSelector';

function WrongWordList({ wrongWords }) {
    const chaptersWithWrongWords = useMemo(() => {
        return Object.keys(wrongWords).filter(chapter => wrongWords[chapter].length > 0);
    }, [wrongWords]);

    const [selectedChapter, setSelectedChapter] = useState(chaptersWithWrongWords[0] || '');

    if (chaptersWithWrongWords.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-6">
                    Wrong Words
                </h2>
                <p className="text-gray-500">Congratulations! You have no wrong words in any chapter.</p>
            </div>
        );
    }

    const chapterWrongWords = wrongWords[selectedChapter] || [];

    return (

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="fixed top-20 right-4 w-64">
                <ChapterSelector chapters={chaptersWithWrongWords} selectedChapter={null} onChapterChange={setSelectedChapter} />
            </div>
            <div className="mr-72 bg-white p-6">

                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-6">
                    Wrong Words
                </h2>


                {chapterWrongWords.length === 0 ? (
                    <p className="text-gray-500">Your wrong words list for this chapter is empty. Great job!</p>
                ) : (
                    <div className="">
                        <div className="flex flex-wrap gap-2">
                            {chapterWrongWords.map((word, index) => (
                                <p key={index} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                                    {word.word}, {word.meaning}
                                </p>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Link
                                to="/practice-wrong-words"
                                state={{ chapter: selectedChapter }}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Practice Wrong Words
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default WrongWordList;