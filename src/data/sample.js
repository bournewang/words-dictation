// src/api/sampleData.js
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

export const generateSampleVocabulary = () => {
    return {
      '3-1': [
        { word: 'ability', meaning: '能力' },
        { word: 'abstract', meaning: '摘要' },
        { word: 'accountant', meaning: '会计' },
      ],
      '3-2': [
        { word: 'cabinet', meaning: '橱柜' },
        { word: 'cable', meaning: '电缆，有线电视' },
        { word: 'cafe', meaning: '咖啡厅' },
        { word: 'cafeteria', meaning: '咖啡店' },
        { word: 'cage', meaning: '笼子' },
      ],
      '3-3': [
        { word: 'debt', meaning: '债务' },
        { word: 'decade', meaning: '十年' },
        { word: 'decision', meaning: '决定' },
        { word: 'decline', meaning: '下降' },
        { word: 'decorations', meaning: '装饰' },
        { word: 'delay', meaning: '耽搁' },
      ],
    };
  };
  
  export const generateSampleChapterSessions = () => {
    return {
      '3-1': {
        sessions: [
          {
            'ability': true,
            'abstract': false,
            'accountant': true
          },
          {
            'ability': true,
            'abstract': true,
            'accountant': true
          }
        ]
      },
      '3-2': {
        sessions: [
          {
            'cabinet': true,
            'cable': false,
            'cafe': true,
            'cafeteria': false,
            'cage': true
          }
        ]
      },
      '3-3': {
        sessions: [
          {
            'debt': true,
            'decade': true,
            'decision': false,
            'decline': true,
            'decorations': false,
            'delay': true
          },
          {
            'debt': true,
            'decade': true,
            'decision': true
          }
        ]
      }
    };
  };

// src/api/sampleData.js

export const generateSampleStatistics = () => {
  return {
    '3-1': [
      { correct: 2, total: 3, rate: '67%' },
      { correct: 3, total: 3, rate: '100%' }
    ],
    '3-2': [
      { correct: 3, total: 5, rate: '60%' }
    ],
    '3-3': [
      { correct: 4, total: 6, rate: '67%' },
      { correct: 3, total: 3, rate: '100%' }
    ]
  };
};  