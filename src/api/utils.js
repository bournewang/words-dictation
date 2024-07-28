// src/utils.js
export const isDev = () => process.env.NODE_ENV === 'development';

export const addWrongWord = (wrongWords, chapter, word) => {
  const chapterWrongWords = wrongWords[chapter] || [];
  if (!chapterWrongWords.some(w => w.word === word.word)) {
    return {
      ...wrongWords,
      [chapter]: [...chapterWrongWords, word]
    };
  }
  return wrongWords;
};

export const removeWrongWord = (wrongWords, chapter, word) => {
  if (!wrongWords[chapter]) return wrongWords;
  return {
    ...wrongWords,
    [chapter]: wrongWords[chapter].filter(w => w.word !== word.word)
  };
};

// Remove the reconstructWrongWords function

// Other utility functions remain the same
// src/utils.js


export const addWordToChapterSession = (chapterSessions, chapter, word, isCorrect) => {
  const chapterData = chapterSessions[chapter] || { sessions: [{}] };
  const updatedSessions = [...chapterData.sessions];
  const lastSession = updatedSessions[updatedSessions.length - 1];
  
  lastSession[word] = isCorrect;

  return {
    ...chapterSessions,
    [chapter]: {
      ...chapterData,
      sessions: updatedSessions
    }
  };
};

export const startNewChapterSession = (chapterSessions, chapter) => {
  return {
    ...chapterSessions,
    [chapter]: {
      sessions: [...(chapterSessions[chapter]?.sessions || []), {}]
    }
  };
};

// src/utils.js

export const hasUnfinishedSession = (chapterSessions, chapter, vocabularyLength) => {
  const sessionData = chapterSessions[chapter];
  if (!sessionData) return false;

  const lastSession = sessionData.sessions[sessionData.sessions.length - 1];
  const completedWords = Object.keys(lastSession).length;

  return completedWords > 0 && completedWords < vocabularyLength;
};

// src/utils.js

// ... existing utility functions

export const addEmptyStatistic = (statistics, chapter) => {
  return {
    ...statistics,
    [chapter]: [
      ...(statistics[chapter] || []),
      { correct: 0, total: 0, rate: '0%' }
    ]
  };
};

export const updateLastStatistic = (statistics, chapter, isCorrect, prevCorrectRates) => {
  const chapterStats = statistics[chapter] || [];
  const correct = prevCorrectRates.correct + (isCorrect ? 1 : 0);
  const total = prevCorrectRates.total + 1;
  const updatedLastStat = {
    correct,
    total,
    rate: ((correct / total) * 100).toFixed(0) + '%'
  };

  return {
    ...statistics,
    [chapter]: [
      ...chapterStats.slice(0, -1),
      updatedLastStat
    ]
  };
};

export const calculateNewCorrectRates = (prevCorrectRates, isCorrect) => {
  const correct = prevCorrectRates.correct + (isCorrect ? 1 : 0);
  const total = prevCorrectRates.total + 1;
  return {
    correct,
    total,
    rate: ((correct / total) * 100).toFixed(0) + '%'
  };
};

export const getLastStatistic = (statistics, chapter) => {
  const chapterStats = statistics[chapter] || [];
  if (chapterStats.length === 0) {
    return { correct: 0, total: 0, rate: '0%' };
  }
  return chapterStats[chapterStats.length - 1];
};