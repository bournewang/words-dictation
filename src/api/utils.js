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

export const createSampleWrongWords = () => {
  const sampleVocabulary = `
3-1,ability,能力,,
3-1,abstract,摘要,,
3-1,accountant,会计,,
3-2,cabinet,橱柜,,
3-2,cable,电缆，有线电视,,
3-2,cafe,咖啡厅,,
3-2,cafeteria,咖啡店,,
3-2,cage,笼子,,
3-3,debt,债务,,
3-3,decade,十年,,
3-3,decision,决定,,
3-3,decline,下降,,
3-3,decorations,装饰,,
3-3,delay,耽搁,,
  `.trim();

  const wrongWords = {};

  sampleVocabulary.split('\n').forEach(line => {
    const [chapter, word, meaning] = line.split(',');
    if (!wrongWords[chapter]) {
      wrongWords[chapter] = [];
    }
    wrongWords[chapter].push({ word, meaning });
  });

  return wrongWords;
};