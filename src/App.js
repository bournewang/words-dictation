import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import VocabularyEditor from './components/VocabularyEditor';
import ExerciseMode from './components/ExerciseMode';
import WrongWordList from './components/WrongWordList';
import CorrectRateDisplay from './components/CorrectRateDisplay';

function App() {
  const [vocabulary, setVocabulary] = useState([]);
  const [wrongWords, setWrongWords] = useState([]);
  const [correctRates, setCorrectRates] = useState({});

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedVocabulary = localStorage.getItem('vocabulary');
    const savedWrongWords = localStorage.getItem('wrongWords');
    const savedCorrectRates = localStorage.getItem('correctRates');

    if (savedVocabulary) {
      setVocabulary(JSON.parse(savedVocabulary));
    }
    if (savedWrongWords) {
      setWrongWords(JSON.parse(savedWrongWords));
    }
    if (savedCorrectRates) {
      setCorrectRates(JSON.parse(savedCorrectRates));
    }
  }, []);

  // Save vocabulary to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
  }, [vocabulary]);

  // Save wrong words to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wrongWords', JSON.stringify(wrongWords));
  }, [wrongWords]);

  // Save correct rates to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('correctRates', JSON.stringify(correctRates));
  }, [correctRates]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex-shrink-0 flex items-center">
                  Home
                </Link>
                <Link to="/editor" className="ml-6 flex items-center">
                  Vocabulary Editor
                </Link>
                <Link to="/wrong-words" className="ml-6 flex items-center">
                  Wrong Words
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <>
                <CorrectRateDisplay rates={correctRates} />
                <ExerciseMode 
                  vocabulary={vocabulary}
                  setWrongWords={setWrongWords}
                  setCorrectRates={setCorrectRates}
                />
              </>
            } />
            <Route path="/editor" element={<VocabularyEditor vocabulary={vocabulary} setVocabulary={setVocabulary} />} />
            <Route path="/wrong-words" element={<WrongWordList wrongWords={wrongWords} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;