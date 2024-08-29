import React, { useState, useEffect, useRef } from 'react';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon, SpeakerWaveIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { speakText } from '../tts';
import { useNavigate } from 'react-router-dom';
import { addWrongWord, removeWrongWord } from '../api/utils';

function ProgressBar({ current, total }) {
    const percentage = (current / total) * 100;
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-6">
            <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
}
function ExerciseMode({
    vocabulary,
    wrongWords,
    setWrongWords,
    correctRates,
    setCorrectRates,
    currentIndex,
    setCurrentIndex,
    updateSessionAndStats,
    practiceMode,
    intervals,
    selectedChapter
}) {
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [completionMessage, setCompletionMessage] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const navigate = useNavigate();
    const isMounted = useRef(false);
    const speakTimeoutRef = useRef(null);

    const currentWord = vocabulary[currentIndex];

    useEffect(() => {
        // Reset currentIndex when vocabulary changes
        // setCurrentIndex(0);
        setIsCompleted(false);
        setCompletionMessage(null);
    }, [vocabulary]);

    useEffect(() => {
        console.log('Effect running, currentIndex, total', currentIndex, vocabulary.length);

        if (currentIndex > vocabulary.length - 1) {
            handleCompletion()
        }
        console.log("current word: ", currentWord)
        console.log("is completed: ", isCompleted)
        if (isMounted.current) {
            if (currentWord && !isCompleted) {
                speakWord();
            }
        } else {
            isMounted.current = true;
        }

        return () => {
            console.log('Effect cleanup, cancel speech:', currentIndex);
            window.speechSynthesis.cancel();
            if (speakTimeoutRef.current) {
                clearTimeout(speakTimeoutRef.current);
            }
        };
    }, [currentIndex, currentWord, isCompleted]);

    const speakWord = () => {
        if (currentWord) {
            setIsPlaying(true);
            speakText(currentWord.word).then(() => {
                setIsPlaying(false);
            }).catch((error) => {
                console.error('Error speaking word:', error);
                setIsPlaying(false);
            });
        }
    };

    const handleSubmit = () => {
        const normalizedUserInput = userInput.toLowerCase().trim().replace(/-/g, ' ');
        const normalizedCorrectWord = currentWord.word.toLowerCase().trim().replace(/-/g, ' ');
        const isCorrect = normalizedUserInput === normalizedCorrectWord;
        
        setFeedback({
          isCorrect,
          word: currentWord.word,
          message: isCorrect ? 'Correct!' : 'Incorrect',
          meaning: currentWord.meaning
        });
    
        if (practiceMode === 'normal') {
            updateSessionAndStats(currentWord.word, isCorrect);
        }else if (practiceMode === 'wrong' && isCorrect) {
            const newWrongWords = removeWrongWord(wrongWords, selectedChapter, currentWord);
            setWrongWords(newWrongWords)
        }
    
        setTimeout(() => {
          setUserInput('');
          setShowExplanation(false);
        //   setFeedback(null);
        }, isCorrect ? intervals.correct : intervals.incorrect);
      };

    const handleCompletion = () => {
        const message = `Congratulations! You've completed all ${practiceMode === 'normal' ? 'words' : 'wrong words'}.`;
        setIsCompleted(true);
        setCompletionMessage(message);
    };

    const resetExercise = () => {
        setIsCompleted(false);
        setCurrentIndex(0);
        setCompletionMessage(null)
        setUserInput('');
        setFeedback(null);
    };

    const toggleExplanation = () => {
        setShowExplanation(!showExplanation);
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-2xl rounded-lg overflow-hidden relative">
            {isCompleted ? (
                <div className="px-6 py-8">
                    <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-md">
                        <CheckCircleIcon className="h-5 w-5 inline mr-2" />
                        {completionMessage}
                    </div>
                    {practiceMode === 'normal' &&
                        <button
                            onClick={resetExercise}
                            className="mt-4 w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <ArrowPathIcon className="h-5 w-5 mr-2" />
                            Start Over
                        </button>
                    }
                </div>
            ) : (
                <div className="px-6 py-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {practiceMode === 'normal' ? 'Vocabulary Practice' : 'Wrong Words Practice'}
                    </h2>
                    {currentWord && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-indigo-600">

                                    {practiceMode === 'normal' ?
                                        <> Word {currentIndex + 1} of {vocabulary.length}</>
                                        :
                                        <> Left: {vocabulary.length}</>
                                    }
                                </p>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={toggleExplanation}
                                        className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none bg-blue-100 hover:bg-blue-200"
                                    >
                                        <InformationCircleIcon className="h-6 w-6 text-blue-600" />
                                    </button>
                                    <button
                                        onClick={speakWord}
                                        disabled={isPlaying}
                                        className={`flex items-center justify-center w-12 h-12 rounded-full focus:outline-none ${isPlaying ? 'bg-gray-200 cursor-not-allowed' : 'bg-indigo-100 hover:bg-indigo-200'
                                            }`}
                                    >
                                        <SpeakerWaveIcon className={`h-6 w-6 ${isPlaying ? 'text-gray-400' : 'text-indigo-600'}`} />
                                    </button>
                                </div>
                            </div>
                            {showExplanation && (
                                <div className="mt-2 px-7 py-3">
                                    <p className="text-sm text-gray-500">
                                        Meaning: {currentWord.meaning}
                                    </p>
                                </div>
                            )}
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
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full text-center text-3xl border-gray-300 rounded-md p-2 mt-4"
                                    placeholder="Enter word here"
                                    autoFocus
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
                                        <p className="mt-1"><span className="font-medium">Word:</span> {feedback.word}</p>
                                        <p><span className="font-medium">Meaning:</span> {feedback.meaning}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isCompleted && practiceMode === 'normal' && (
                        <ProgressBar current={currentIndex + 1} total={vocabulary.length} />
                    )}
                </div>
            )}
        </div>
    );
}

export default ExerciseMode;