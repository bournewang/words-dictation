import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import VocabularyEditor from './components/VocabularyEditor';
import ExerciseMode from './components/ExerciseMode';
import WrongWordList from './components/WrongWordList';
import CorrectRateDisplay from './components/CorrectRateDisplay';
import StatisticsPage from './components/StatisticsPage';
import ChapterSelector from './components/ChapterSelector';
import Settings from './components/Settings';

function WrongWordsCount({ count }) {
  return (
    <div className=" text-red-800 bg-white rounded-lg p-4 px-4 py-2 rounded-lg shadow mb-4">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Wrong Words: {count}</h3>
    </div>
  );
}

function App() {
  const [vocabulary, setVocabulary] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [correctRates, setCorrectRates] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervals, setIntervals] = useState({ correct: 2000, incorrect: 3000 }); // Default intervals
  const [exerciseStats, setExerciseStats] = useState({});
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [chapterVocabulary, setChapterVocabulary] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedVocabulary = localStorage.getItem('vocabulary');
    const savedWrongWords = localStorage.getItem('wrongWords');
    const savedCorrectRates = localStorage.getItem('correctRates');
    const savedIntervals = localStorage.getItem('intervals');
    const savedExerciseStats = localStorage.getItem('exerciseStats');
    const savedSelectedChapter = localStorage.getItem('selectedChapter');
    
    if (savedVocabulary) setVocabulary(JSON.parse(savedVocabulary));
    if (savedWrongWords) setWrongWords(JSON.parse(savedWrongWords));
    if (savedCorrectRates) setCorrectRates(JSON.parse(savedCorrectRates));
    if (savedIntervals) setIntervals(JSON.parse(savedIntervals));
    if (savedExerciseStats) setExerciseStats(JSON.parse(savedExerciseStats));
    if (savedSelectedChapter) setSelectedChapter(savedSelectedChapter);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
    localStorage.setItem('wrongWords', JSON.stringify(wrongWords));
    localStorage.setItem('correctRates', JSON.stringify(correctRates));
    localStorage.setItem('currentIndex', currentIndex.toString());
    localStorage.setItem('intervals', JSON.stringify(intervals));
    localStorage.setItem('exerciseStats', JSON.stringify(exerciseStats));
    localStorage.setItem('selectedChapter', selectedChapter);
  }, [vocabulary, wrongWords, correctRates, currentIndex, intervals, exerciseStats, selectedChapter]);


  // Get unique chapters
  const chapters = useMemo(() => ['all', ...Object.keys(vocabulary).sort()]);

  const onChapterChange = (chapter) => {
    setSelectedChapter(chapter);
    // filter all vocabulary with chapter
    setChapterVocabulary(vocabulary[chapter] || []);
  };


  const updateExerciseStats = (isCorrect) => {
    // is it better to use selectedChapter || 'all'?
    const chapter = selectedChapter || 'all';
    setExerciseStats(prevStats => {
      const chapterStats = prevStats[chapter] || { total: 0, correct: 0, wrong: 0 };
      return {
        ...prevStats,
        [chapter]: {
          total: chapterStats.total + 1,
          correct: chapterStats.correct + (isCorrect ? 1 : 0),
          wrong: chapterStats.wrong + (isCorrect ? 0 : 1)
        }
      };
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center">
                  Exercise
                </Link>
                <Link to="/editor" className="ml-6 flex items-center">
                  Vocabulary Editor
                </Link>
                <Link to="/wrong-words" className="ml-6 flex items-center">
                  Wrong Words
                </Link>
                <Link to="/statistics" className="ml-6 flex items-center">
                  Statistics
                </Link>                
                <Link to="/settings" className="ml-6 flex items-center">
                  Settings
                </Link>                
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <>
                <div className="fixed top-20 right-4">
                  <WrongWordsCount count={wrongWords.length} />
                  <CorrectRateDisplay rates={correctRates} />
                </div>
                <>selectedChapter: {selectedChapter}</>
                <ChapterSelector
                  chapters={chapters}
                  selectedChapter={selectedChapter}
                  onChapterChange={onChapterChange}
                />
                <ExerciseMode
                  vocabulary={chapterVocabulary}
                  wrongWords={wrongWords}
                  setWrongWords={setWrongWords}
                  setCorrectRates={setCorrectRates}
                  currentIndex={currentIndex}
                  setCurrentIndex={setCurrentIndex}
                  practiceMode="normal"
                  intervals={intervals}
                  updateExerciseStats={updateExerciseStats}
                />
              </>
            } />
            <Route path="/editor" element={<VocabularyEditor vocabulary={vocabulary} setVocabulary={setVocabulary} />} />
            <Route path="/wrong-words" element={<WrongWordList wrongWords={wrongWords} />} />
            <Route path="/practice-wrong-words" element={
              <ExerciseMode
                vocabulary={wrongWords}
                wrongWords={wrongWords}
                setWrongWords={setWrongWords}
                setCorrectRates={setCorrectRates}
                currentIndex={0}
                setCurrentIndex={setCurrentIndex}
                practiceMode="wrong"
                intervals={intervals}
              />
            } />
            <Route path="/statistics" element={<StatisticsPage exerciseStats={exerciseStats} />} />
            <Route path="/settings" element={<Settings intervals={intervals} setIntervals={setIntervals} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;