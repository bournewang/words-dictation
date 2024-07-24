import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';
import { speakText } from '../tts';

function ExerciseMode({ vocabulary, setWrongWords, setCorrectRates }) {
//   const [currentWord, setCurrentWord] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);  

  const currentWord = vocabulary[currentIndex];

  useEffect(() => {
    const currentWord = vocabulary[currentIndex];
    if (currentWord) {
      speakWord();
    }
  }, [currentIndex]);

  const speakWord = () => {
    if (currentWord) {
      setIsPlaying(true);
      speakText(currentWord.word);
      setIsPlaying(false);
    //   const utterance = new SpeechSynthesisUtterance(currentWord.word);
    //   utterance.onend = () => setIsPlaying(false);
    //   window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    const isCorrect = userInput.toLowerCase() === currentWord.word.toLowerCase();
    setFeedback({
      isCorrect,
      message: isCorrect ? 'Correct!' : 'Incorrect',
      meaning: currentWord.meaning
    });

    updateCorrectRate(isCorrect);
    if (!isCorrect) {
      setWrongWords(prev => [...prev, currentWord]);
    }

    setTimeout(() => {
      setFeedback(null);
      setUserInput('');
      moveToNextWord();
    }, isCorrect ? 1000 : 3000);
  };

  const moveToNextWord = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      // End of list reached
      alert("Congratulations! You've completed all words.");
      setCurrentIndex(0); // Optionally restart from the beginning
    }
  };
  const updateCorrectRate = (isCorrect) => {
    setCorrectRates(prev => {
      const chapter = currentWord.chapter;
      const chapterRate = prev[chapter] || { correct: 0, total: 0 };
      return {
        ...prev,
        [chapter]: {
          correct: chapterRate.correct + (isCorrect ? 1 : 0),
          total: chapterRate.total + 1
        }
      };
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Vocabulary Practice</h2>
        {currentWord && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-indigo-600">Chapter: {currentWord.chapter}</p>
              <button
                onClick={speakWord}
                disabled={isPlaying}
                className={`flex items-center justify-center w-12 h-12 rounded-full focus:outline-none ${
                  isPlaying ? 'bg-gray-200 cursor-not-allowed' : 'bg-indigo-100 hover:bg-indigo-200'
                }`}
              >
                <SpeakerWaveIcon className={`h-6 w-6 ${isPlaying ? 'text-gray-400' : 'text-indigo-600'}`} />
              </button>
            </div>
            <div>
              <label htmlFor="word-input" className="block text-sm font-medium text-gray-700 mb-1">
                Type the word you hear:
              </label>
              <input
                id="word-input"
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-lg border-gray-300 rounded-md p-2"
                placeholder="Enter word here"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        )}
        {feedback && (
          <div className={`mt-6 p-4 ${feedback.isCorrect ? 'bg-green-50' : 'bg-red-50'} rounded-md`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {feedback.isCorrect ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                )}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {feedback.message}
                </h3>
                <div className={`mt-2 text-sm ${feedback.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  <p><span className="font-medium">Meaning:</span> {feedback.meaning}</p>
                  {!feedback.isCorrect && (
                    <p className="mt-1"><span className="font-medium">Correct word:</span> {currentWord.word}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExerciseMode;