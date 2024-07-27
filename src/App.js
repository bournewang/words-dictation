import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VocabularyEditor from './components/VocabularyEditor';
import ExerciseMode from './components/ExerciseMode';
import WrongWordList from './components/WrongWordList';
import CorrectRateDisplay from './components/CorrectRateDisplay';
import StatisticsPage from './components/StatisticsPage';
import ChapterSelector from './components/ChapterSelector';
import Settings from './components/Settings';
import PracticeSessionControls from './components/PracticeSessionControls';
import ChapterSessionDetails from './components/ChapterSessionDetails';
import ChapterSummary from './components/ChapterSummary';
import { loadVocabulary } from './api/loaddata';
import { addWrongWord, removeWrongWord, getWrongWordsArray, reconstructWrongWords } from './api/utils';

const initCorrectRates = { correct: 0, total: 0, rate: '0%' };

function App() {
  const [vocabulary, setVocabulary] = useState({});
  const [wrongWords, setWrongWords] = useState({});
  const [correctRates, setCorrectRates] = useState(initCorrectRates);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervals, setIntervals] = useState({ correct: 2000, incorrect: 3000 });
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterVocabulary, setChapterVocabulary] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [chapterSessions, setChapterSessions] = useState({});
  const [isPracticing, setIsPracticing] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedVocabulary = localStorage.getItem('vocabulary');
    const savedWrongWords = localStorage.getItem('wrongWords');
    const savedCorrectRates = localStorage.getItem('correctRates');
    const savedCurrentIndex = localStorage.getItem('currentIndex');
    const savedIntervals = localStorage.getItem('intervals');
    const savedSelectedChapter = localStorage.getItem('selectedChapter');
    const savedStatistics = localStorage.getItem('statistics');
    const savedChapterSessions = localStorage.getItem('chapterSessions');

    if (savedVocabulary) setVocabulary(JSON.parse(savedVocabulary));
    if (savedWrongWords) {
      try {
        const parsedWrongWords = JSON.parse(savedWrongWords);
        if (typeof parsedWrongWords === 'object' && parsedWrongWords !== null) {
          setWrongWords(parsedWrongWords);
        } else {
          console.error('Saved wrong words are not in the correct format');
          setWrongWords({});
        }
      } catch (error) {
        console.error('Error parsing saved wrong words:', error);
        setWrongWords({});
      }
    }
    if (savedCorrectRates) setCorrectRates(JSON.parse(savedCorrectRates));
    if (savedCurrentIndex) setCurrentIndex(parseInt(savedCurrentIndex));
    if (savedIntervals) setIntervals(JSON.parse(savedIntervals));
    if (savedSelectedChapter) setSelectedChapter(savedSelectedChapter);
    if (savedStatistics) setStatistics(JSON.parse(savedStatistics));
    if (savedChapterSessions) setChapterSessions(JSON.parse(savedChapterSessions));

    loadVocabulary(setVocabulary);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
    localStorage.setItem('wrongWords', JSON.stringify(wrongWords));
    localStorage.setItem('correctRates', JSON.stringify(correctRates));
    localStorage.setItem('currentIndex', currentIndex.toString());
    localStorage.setItem('intervals', JSON.stringify(intervals));
    localStorage.setItem('selectedChapter', selectedChapter);
    localStorage.setItem('statistics', JSON.stringify(statistics));
    localStorage.setItem('chapterSessions', JSON.stringify(chapterSessions));
  }, [vocabulary, wrongWords, correctRates, currentIndex, intervals, statistics, selectedChapter, chapterSessions]);

  // Get unique chapters
  const chapters = useMemo(() => Object.keys(vocabulary), [vocabulary]);

  const onChapterChange = (chapter) => {
    setSelectedChapter(chapter);
    setChapterVocabulary(vocabulary[chapter] || []);
    setCorrectRates(initCorrectRates);
    setIsPracticing(false);
    if (!isInitialLoad) {
      setCurrentIndex(chapterSessions[chapter]?.currentIndex || 0);
    }
  };

  useEffect(() => {
    if (isInitialLoad && chapters.length > 0) {
      onChapterChange(chapters[0]);
      setIsInitialLoad(false);
    }
  }, [chapters, isInitialLoad]);

  const updateCorrectRates = (value) => {
    setCorrectRates(value);

    setChapterSessions(prev => {
      const chapter = selectedChapter;
      const sessionData = prev[chapter];
      if (sessionData) {
        const updatedSessions = [...sessionData.sessions];
        const currentWord = chapterVocabulary[currentIndex];
        const isCorrect = value.correct > correctRates.correct;
        updatedSessions[updatedSessions.length - 1].push({
          isCorrect,
          word: currentWord.word
        });

        // Update wrong words
        if (!isCorrect) {
          setWrongWords(prevWrongWords => addWrongWord(prevWrongWords, chapter, currentWord));
        }

        return {
          ...prev,
          [chapter]: {
            ...sessionData,
            currentIndex: currentIndex + 1,
            sessions: updatedSessions
          }
        };
      }
      return prev;
    });

    // Update statistics only when the session is completed or at specific intervals
    setStatistics(prev => {
      const chapter = selectedChapter;
      const chapterStats = prev[chapter] || [];
      const lastStat = chapterStats[chapterStats.length - 1];

      // Only update if it's a new session or we've reached a milestone (e.g., every 10 words)
      if (!lastStat || value.total % 10 === 0 || value.total === chapterVocabulary.length) {
        return {
          ...prev,
          [chapter]: [...chapterStats, value]
        };
      }

      // Otherwise, just update the last statistic
      return {
        ...prev,
        [chapter]: [...chapterStats.slice(0, -1), value]
      };
    });
  };

  const startNewPracticeSession = () => {
    setChapterSessions(prev => ({
      ...prev,
      [selectedChapter]: {
        currentIndex: 0,
        sessions: [...(prev[selectedChapter]?.sessions || []), []]
      }
    }));
    setCurrentIndex(0);
    setCorrectRates(initCorrectRates);
    setIsPracticing(true);

    // Add a new rate to statistics when starting a new session
    setStatistics(prev => ({
      ...prev,
      [selectedChapter]: [
        ...(prev[selectedChapter] || []),
        { correct: 0, total: 0, rate: '0%' }
      ]
    }));
  };

  const resumePracticeSession = () => {
    const sessionData = chapterSessions[selectedChapter];
    if (sessionData) {
      setCurrentIndex(sessionData.currentIndex);
      const lastSession = sessionData.sessions[sessionData.sessions.length - 1];
      const correct = lastSession.filter(attempt => attempt.isCorrect).length;
      const total = lastSession.length;
      const newCorrectRates = {
        correct,
        total,
        rate: total > 0 ? `${((correct / total) * 100).toFixed(0)}%` : '0%'
      };
      setCorrectRates(newCorrectRates);
      setIsPracticing(true);
    }
  };

  const endPracticeSession = () => {
    setIsPracticing(false);
  };

  const hasUnfinishedSession = useMemo(() => {
    const sessionData = chapterSessions[selectedChapter];
    return sessionData && sessionData.currentIndex < chapterVocabulary.length;
  }, [chapterSessions, selectedChapter, chapterVocabulary]);

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
                <Link to="/wrong-words" className="ml-6 flex items-center">
                  Wrong Words
                </Link>
                <Link to="/practice-history" className="ml-6 flex items-center">
                  Practice History
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
                <div className="fixed top-20 right-4 w-64">
                  <ChapterSelector
                    chapters={chapters}
                    selectedChapter={selectedChapter}
                    onChapterChange={onChapterChange}
                  />
                  <CorrectRateDisplay rates={correctRates} />
                  {selectedChapter && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Previous Sessions:</h3>
                      <ul className="space-y-1">
                        {chapterSessions[selectedChapter]?.sessions.map((session, index) => {
                          const correct = session.filter(attempt => attempt.isCorrect).length;
                          const total = session.length;
                          const rate = total > 0 ? `${((correct / total) * 100).toFixed(0)}%` : '0%';
                          return (
                            <li key={index} className="text-sm">
                              Session {index + 1}: {rate} ({correct}/{total})
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mr-72">
                  {chapterVocabulary.length < 1 ? (
                    <div className="max-w-md mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
                      <div className="px-6 py-8">
                        <p className="text-lg text-gray-600 text-center">
                          Select a chapter to continue.
                        </p>
                      </div>
                    </div>
                  ) : isPracticing ? (
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
                      onComplete={endPracticeSession}
                    />
                  ) : (
                    <>
                      <ChapterSummary
                        chapterName={selectedChapter}
                        wordCount={chapterVocabulary.length}
                        currentIndex={chapterSessions[selectedChapter]?.currentIndex || 0}
                      />
                      <PracticeSessionControls
                        onStartNewSession={startNewPracticeSession}
                        onResumePractice={resumePracticeSession}
                        hasUnfinishedSession={hasUnfinishedSession}
                      />
                    </>
                  )}
                </div>
              </>
            } />
            <Route path="/wrong-words" element={<WrongWordList wrongWords={wrongWords} />} />
            <Route path="/practice-wrong-words" element={
              <ExerciseMode
                vocabulary={Object.values(wrongWords).flat()}
                wrongWords={wrongWords}
                setWrongWords={(updater) => {
                  setWrongWords(prev => {
                    const updatedArray = updater(getWrongWordsArray(prev));
                    return reconstructWrongWords(prev, updatedArray);
                  });
                }}
                correctRates={initCorrectRates}
                setCorrectRates={() => { }}
                currentIndex={0}
                setCurrentIndex={setCurrentIndex}
                practiceMode="wrong"
                intervals={intervals}
              />
            } />
            <Route path="/practice-history" element={<ChapterSessionDetails chapters={chapters} chapterSessions={chapterSessions} vocabulary={vocabulary} />} />
            <Route path="/statistics" element={<StatisticsPage statistics={statistics} />} />
            <Route path="/settings" element={<Settings intervals={intervals} setIntervals={setIntervals} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;