import React, { useState, useEffect } from 'react';

function VocabularyEditor({ vocabulary, setVocabulary }) {
  const [csvInput, setCsvInput] = useState('');

  // Convert vocabulary array to CSV string
  useEffect(() => {
    const csvContent = vocabulary.map(item => `${item.chapter},${item.word},${item.meaning}`).join('\n');
    setCsvInput(csvContent);
  }, [vocabulary]);

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
          Enter vocabulary items in CSV format: chapter,word,meaning
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