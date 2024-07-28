import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
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
import { addWrongWord, 
  addWordToChapterSession,
  startNewChapterSession,
  hasUnfinishedSession,
  addEmptyStatistic,
  updateLastStatistic,
  calculateNewCorrectRates,
  getLastStatistic
} from './api/utils';
import { createSampleWrongWords } from './api/utils';

const initCorrectRates = { correct: 0, total: 0, rate: '0%' };

function App() {
  const [vocabulary, setVocabulary] = useState({});
  const [wrongWords, setWrongWords] = useState(createSampleWrongWords());
  const [correctRates, setCorrectRates] = useState(initCorrectRates);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervals, setIntervals] = useState({ correct: 1000, incorrect: 3000 });
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

  const updateSessionAndStats = (word, isCorrect) => {
    setChapterSessions(prev => 
      addWordToChapterSession(prev, selectedChapter, word, isCorrect)
    );

    setCorrectRates(prev => calculateNewCorrectRates(prev, isCorrect));

    setStatistics(prev => updateLastStatistic(prev, selectedChapter, isCorrect, correctRates));

    if (!isCorrect) {
      setWrongWords(prev => addWrongWord(prev, selectedChapter, chapterVocabulary[currentIndex]));
    }

    setCurrentIndex(prev => prev + 1);
  };

  const startNewPracticeSession = () => {
    setChapterSessions(prev => startNewChapterSession(prev, selectedChapter));
    setCurrentIndex(0);
    setCorrectRates({ correct: 0, total: 0, rate: '0%' });
    setIsPracticing(true);

    setStatistics(prev => addEmptyStatistic(prev, selectedChapter));
  };

  const resumePracticeSession = () => {
    const sessionData = chapterSessions[selectedChapter];
    if (sessionData) {
      const lastSession = sessionData.sessions[sessionData.sessions.length - 1];
      const completedWords = Object.keys(lastSession).length;
      setCurrentIndex(completedWords);

      // Use the new helper function to get the last statistic
      const lastStat = getLastStatistic(statistics, selectedChapter);
      setCorrectRates(lastStat);

      setIsPracticing(true);
    }
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
                        {statistics[selectedChapter]?.map((session, index) => {
                          return (
                            <li key={index} className="text-sm">
                              Session {index + 1}: {session.rate} 
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
                      currentIndex={currentIndex}
                      updateSessionAndStats={updateSessionAndStats}
                      practiceMode="normal"
                      intervals={intervals}
                      selectedChapter={selectedChapter}
                      onComplete={() => setIsPracticing(false)}
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
                        chapterSessions={chapterSessions}
                        selectedChapter={selectedChapter}
                        vocabularyLength={chapterVocabulary.length}
                      />
                    </>
                  )}
                </div>
              </>
            } />
            <Route path="/wrong-words" element={<WrongWordList wrongWords={wrongWords} chapters={chapters} />} />
            <Route path="/practice-wrong-words" element={<PracticeWrongWords
              wrongWords={wrongWords}
              setWrongWords={setWrongWords}
              initCorrectRates={initCorrectRates}
              intervals={intervals}
            />} />
            <Route path="/practice-history" element={<ChapterSessionDetails chapters={chapters} chapterSessions={chapterSessions} vocabulary={vocabulary} />} />
            <Route path="/statistics" element={<StatisticsPage statistics={statistics} />} />
            <Route path="/settings" element={<Settings intervals={intervals} setIntervals={setIntervals} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function PracticeWrongWords({ wrongWords, setWrongWords, initCorrectRates, intervals }) {
  const location = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctRates, setCorrectRates] = useState(initCorrectRates);
  const selectedChapter = location.state?.chapter || Object.keys(wrongWords)[0];

  return (
    <ExerciseMode
      vocabulary={wrongWords[selectedChapter] || []}
      wrongWords={wrongWords}
      setWrongWords={setWrongWords}
      correctRates={correctRates}
      setCorrectRates={() => {}}
      currentIndex={currentIndex}
      setCurrentIndex={setCurrentIndex}
      updateSessionAndStats={()=>{}}
      practiceMode="wrong"
      intervals={intervals}
      selectedChapter={selectedChapter}
    />
  );
}

export default App;