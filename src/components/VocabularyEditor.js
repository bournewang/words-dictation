// VocabularyEditor.js
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

function VocabularyEditor({ vocabulary, setVocabulary }) {
    const [csvInput, setCsvInput] = useState('');

    useEffect(() => {
        // Import the CSV file
        import('../data/vocabulary.csv')
            .then(module => {
                // The imported module contains the file path, not the content
                // We need to fetch the content using this path
                fetch(module.default)
                    .then(response => response.text())
                    .then(csvData => {
                        Papa.parse(csvData, {
                            complete: (results) => {
                                if (results.data && results.data.length > 0) {
                                    const vocabularyByChapter = results.data
                                        .filter(row => row.length >= 3) // Ensure each row has at least 3 columns
                                        .reduce((acc, row) => {
                                            const chapter = row[0].trim();
                                            const word = row[1].trim();
                                            const meaning = row[2].trim();

                                            if (!acc[chapter]) {
                                                acc[chapter] = [];
                                            }

                                            acc[chapter].push({ word, meaning });
                                            return acc;
                                        }, {});

                                    if (Object.keys(vocabularyByChapter).length > 0) {
                                        setVocabulary(vocabularyByChapter);

                                        // Create CSV content for display
                                        const csvContent = Object.entries(vocabularyByChapter)
                                            .flatMap(([chapter, words]) =>
                                                words.map(({ word, meaning }) => `${chapter},${word},${meaning}`)
                                            )
                                            .join('\n');

                                        setCsvInput(csvContent);
                                    } else {
                                        console.error('No valid vocabulary entries found');
                                        alert('No valid vocabulary entries found in the CSV file. Please check the file format.');
                                    }
                                } else {
                                    console.error('CSV parsing resulted in empty data');
                                    alert('Error parsing CSV file. Please check the file format.');
                                }
                            },
                            error: (error) => {
                                console.error('Error parsing CSV:', error);
                                alert('Error parsing CSV file. Please check the file format.');
                            }
                        });
                    });
            })
            .catch(error => {
                console.error('Error importing CSV file:', error);
                alert('Error loading CSV file. Please check if the file exists and is accessible.');
            });
    }, [setVocabulary]);

    const handleSave = () => {
        try {
            const newVocabulary = csvInput.split('\n').map(line => {
                const [chapter, word, meaning] = line.split(',');
                if (!chapter || !word || !meaning) {
                    throw new Error('Invalid CSV format');
                }
                return { chapter: chapter.trim(), word: word.trim(), meaning: meaning.trim() };
            });
            setVocabulary(newVocabulary);
            alert('Vocabulary saved successfully!');
        } catch (error) {
            alert('Invalid CSV format. Please check your input.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Vocabulary</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Edit vocabulary items in CSV format: chapter,word,meaning
                </p>
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
        </div>
    );
}

export default VocabularyEditor;