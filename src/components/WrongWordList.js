import React from 'react';
import { Link } from 'react-router-dom';

function WrongWordList({ wrongWords }) {

    if (wrongWords.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Wrong Words
                    </h2>
                </div>
                <p className="text-gray-500">Your wrong words list is empty. Great job! Keep practicing to maintain your skills.</p>
            </div>
        );
    }
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    Wrong Words: {wrongWords.length}
                </h2>
                <Link
                    to="/practice-wrong-words"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Practice Wrong Words
                </Link>
            </div>
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