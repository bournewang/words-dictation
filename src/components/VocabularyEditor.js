import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

function VocabularyEditor({ vocabulary, setVocabulary }) {
    const [csvInput, setCsvInput] = useState('');
    const [message, setMessage] = useState(null);

    // Convert vocabulary object to CSV string
    useEffect(() => {
        const csvContent = Object.entries(vocabulary).flatMap(([chapter, words]) => 
            words.map(word => `${chapter},${word.word},${word.meaning}`)
        ).join('\n');
        setCsvInput(csvContent);
    }, [vocabulary]);

    const handleSave = () => {
        try {
            const newVocabulary = csvInput.split('\n').reduce((acc, line) => {
                const [chapter, word, meaning] = line.split(',');
                if (!chapter || !word) {
                    throw new Error('Invalid CSV format');
                }
                const chapterKey = chapter.trim();
                if (!acc[chapterKey]) {
                    acc[chapterKey] = [];
                }
                acc[chapterKey].push({
                    word: word.trim(),
                    meaning: meaning.trim()
                });
                return acc;
            }, {});

            setVocabulary(newVocabulary);
            setMessage('Vocabulary saved successfully!');
            setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
        } catch (error) {
            setMessage('Invalid CSV format. Please check your input. ' + error.message);
            setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Vocabulary</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Enter vocabulary items in CSV format: chapter,word,meaning
                </p>
                {Object.keys(vocabulary).length === 0 && (
                    <p className="text-lg text-gray-600 text-center mb-6">
                        Your vocabulary list is empty. Start adding words using the CSV format below.
                    </p>
                )}
                <textarea
                    rows="20"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    placeholder="3-2,congestion,拥挤&#10;3-2,conqueror,征服者&#10;3-2,conquest,征服"
                />
                <div className="mt-5">
                    <button
                        onClick={handleSave}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Vocabulary
                    </button>
                </div>
            </div>
            {message && (
                <div className={`mb-4 p-4 rounded-md ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.includes('successfully') ? (
                        <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                    ) : (
                        <XCircleIcon className="h-5 w-5 inline mr-2" />
                    )}
                    {message}
                </div>
            )}
        </div>
    );
}

export default VocabularyEditor;