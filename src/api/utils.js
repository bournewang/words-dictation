// src/utils.js

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
  
  export const removeWrongWord = (wrongWords, word) => {
    const updatedWrongWords = {};
    Object.keys(wrongWords).forEach(chapter => {
      updatedWrongWords[chapter] = wrongWords[chapter].filter(w => w.word !== word.word);
    });
    return updatedWrongWords;
  };
  
  export const getWrongWordsArray = (wrongWords) => {
    return Object.values(wrongWords).flat();
  };
  
  export const reconstructWrongWords = (wrongWords, updatedArray) => {
    return Object.keys(wrongWords).reduce((acc, chapter) => {
      acc[chapter] = updatedArray.filter(word => 
        wrongWords[chapter].some(w => w.word === word.word)
      );
      return acc;
    }, {});
  };