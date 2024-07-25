import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VocabularyEditor from './components/VocabularyEditor';
import ExerciseMode from './components/ExerciseMode';
import WrongWordList from './components/WrongWordList';
import CorrectRateDisplay from './components/CorrectRateDisplay';
import StatisticsPage from './components/StatisticsPage';
import ChapterSelector from './components/ChapterSelector';
import Settings from './components/Settings';

function App() {
  const [vocabulary, setVocabulary] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [correctRates, setCorrectRates] = useState({ correct: 0, total: 0, rate: '0%' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervals, setIntervals] = useState({ correct: 2000, incorrect: 3000 }); // Default intervals
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterVocabulary, setChapterVocabulary] = useState([]);
  const [practiceSessions, setPracticeSessions] = useState({});
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [statistics, setStatistics] = useState({});

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedVocabulary = localStorage.getItem('vocabulary');
    const savedWrongWords = localStorage.getItem('wrongWords');
    const savedCorrectRates = localStorage.getItem('correctRates');
    const savedCurrentIndex = localStorage.getItem('currentIndex');
    const savedIntervals = localStorage.getItem('intervals');
    const savedSelectedChapter = localStorage.getItem('selectedChapter');
    const savedPracticeSessions = localStorage.getItem('practiceSessions');
    const savedCurrentSessionIndex = localStorage.getItem('currentSessionIndex');
    const savedStatistics = localStorage.getItem('statistics');
    if (savedStatistics) setStatistics(JSON.parse(savedStatistics));

    if (savedVocabulary) setVocabulary(JSON.parse(savedVocabulary));
    if (savedWrongWords) setWrongWords(JSON.parse(savedWrongWords));
    if (savedCorrectRates) setCorrectRates(JSON.parse(savedCorrectRates));
    if (savedCurrentIndex) setCurrentIndex(parseInt(savedCurrentIndex));
    if (savedIntervals) setIntervals(JSON.parse(savedIntervals));
    if (savedSelectedChapter) setSelectedChapter(savedSelectedChapter);
    if (savedPracticeSessions) setPracticeSessions(JSON.parse(savedPracticeSessions));
    if (savedCurrentSessionIndex) setCurrentSessionIndex(parseInt(savedCurrentSessionIndex));

  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
    localStorage.setItem('wrongWords', JSON.stringify(wrongWords));
    localStorage.setItem('correctRates', JSON.stringify(correctRates));
    localStorage.setItem('currentIndex', currentIndex.toString());
    localStorage.setItem('intervals', JSON.stringify(intervals));
    localStorage.setItem('selectedChapter', selectedChapter);
    localStorage.setItem('practiceSessions', JSON.stringify(practiceSessions));
    localStorage.setItem('currentSessionIndex', currentSessionIndex.toString());
    localStorage.setItem('statistics', JSON.stringify(statistics));

  }, [vocabulary, wrongWords, correctRates, currentIndex, intervals, statistics, selectedChapter, practiceSessions, currentSessionIndex]);

  // Get unique chapters
  const chapters = useMemo(() => Object.keys(vocabulary));

  const onChapterChange = (chapter) => {
    setSelectedChapter(chapter);
    setCurrentIndex(0)
    // filter all vocabulary with chapter
    setChapterVocabulary(vocabulary[chapter] || []);
    startNewPracticeSession()
  };

  const updateStatistics = (value) => {
    setStatistics(prev => {
      const chapter = selectedChapter;
      const chapterStats = prev[chapter] || [];
      const currentSessionIndex = chapterStats.length - 1;

      return {
        ...prev,
        [chapter]: [
          ...chapterStats.slice(0, currentSessionIndex),
          value,
          ...chapterStats.slice(currentSessionIndex + 1)
        ]
      };
    });
  };

  const startNewPracticeSession = () => {
    setPracticeSessions(prev => ({
      ...prev,
      [selectedChapter]: [...(prev[selectedChapter] || []), { correct: 0, total: 0 }]
    }));
    setCurrentSessionIndex(prev => prev + 1);
  };

  const updateCorrectRates = (value) => {
    setCorrectRates(value)
    updateStatistics(value);
    // ... other necessary updates
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
                  <ChapterSelector
                    chapters={chapters}
                    selectedChapter={selectedChapter}
                    onChapterChange={onChapterChange}
                  />
                  <CorrectRateDisplay rates={correctRates} />
                </div>


                {chapterVocabulary.length < 1 ?
                  <div className="max-w-md mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
                    <div className="px-6 py-8">
                      <p className="text-lg text-gray-600 text-center">
                        Select a chapter to continue.
                      </p>
                    </div>
                  </div>
                  :
                  <ExerciseMode
                    vocabulary={chapterVocabulary}
                    wrongWords={wrongWords}
                    setWrongWords={setWrongWords}
                    correctRates={correctRates}
                    setCorrectRates={updateCorrectRates}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    practiceMode="normal"
                    intervals={intervals}
                  />
                }
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
            <Route path="/statistics" element={<StatisticsPage statistics={statistics} />} />
            <Route path="/settings" element={<Settings intervals={intervals} setIntervals={setIntervals} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;