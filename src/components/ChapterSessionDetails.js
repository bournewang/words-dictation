// src/components/ChapterSessionDetails.js
import React, { useState, useMemo } from 'react';
import { CheckCircleIcon, XCircleIcon, MinusCircleIcon } from '@heroicons/react/24/solid';
import ChapterSelector from './ChapterSelector';

function ChapterSessionDetails({ chapters, chapterSessions, vocabulary }) {
    const [selectedChapter, setSelectedChapter] = useState(chapters[0] || '');

    const sessionData = useMemo(() => {
        if (!selectedChapter || !vocabulary[selectedChapter]) return [];

        const chapterVocabulary = vocabulary[selectedChapter];
        const sessions = chapterSessions[selectedChapter]?.sessions || [];

        return chapterVocabulary.map(wordObj => ({
            word: wordObj.word,
            meaning: wordObj.meaning,
            attempts: sessions.map(session => session[wordObj.word])
        }));
    }, [selectedChapter, chapterSessions, vocabulary]);

    const sessionCount = chapterSessions[selectedChapter]?.sessions.length || 0;

    return (
        <div>
            <div className="fixed top-20 right-4 w-64">
                <ChapterSelector chapters={chapters} selectedChapter={selectedChapter} onChapterChange={setSelectedChapter} />
            </div>
            <div className="mr-72">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Word
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Meaning
                                </th>
                                {[...Array(sessionCount)].map((_, index) => (
                                    <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Session {index + 1}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {sessionData.map((row) => (
                                <tr key={row.word}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {row.word}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {row.meaning}
                                    </td>
                                    {row.attempts.map((isCorrect, index) => (
                                        <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {isCorrect === undefined ? (
                                                <MinusCircleIcon className="h-5 w-5 text-gray-300" />
                                            ) : isCorrect ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-500" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ChapterSessionDetails;