// src/api/utils.test.js

import {
    addWordToChapterSession,
    startNewChapterSession,
    hasUnfinishedSession,
    addEmptyStatistic,
    updateLastStatistic,
    calculateNewCorrectRates,
    getLastStatistic
  } from '../api/utils';
  
  describe('Utils', () => {
    describe('addWordToChapterSession', () => {
      it('should add a word to the last session', () => {
        const initialSessions = { chapter1: { sessions: [{}] } };
        const result = addWordToChapterSession(initialSessions, 'chapter1', 'apple', true);
        expect(result.chapter1.sessions[0].apple).toBe(true);
      });
    });
  
    describe('startNewChapterSession', () => {
      it('should start a new session for a chapter', () => {
        const initialSessions = { chapter1: { sessions: [{ apple: true }] } };
        const result = startNewChapterSession(initialSessions, 'chapter1');
        expect(result.chapter1.sessions.length).toBe(2);
        expect(result.chapter1.sessions[1]).toEqual({});
      });
    });
  
    describe('hasUnfinishedSession', () => {
      it('should return true if there is an unfinished session', () => {
        const sessions = { chapter1: { sessions: [{ apple: true }] } };
        const result = hasUnfinishedSession(sessions, 'chapter1', 2);
        expect(result).toBe(true);
      });
  
      it('should return false if the session is finished', () => {
        const sessions = { chapter1: { sessions: [{ apple: true, banana: false }] } };
        const result = hasUnfinishedSession(sessions, 'chapter1', 2);
        expect(result).toBe(false);
      });
    });
  
    describe('addEmptyStatistic', () => {
      it('should add an empty statistic to a chapter', () => {
        const initialStats = {};
        const result = addEmptyStatistic(initialStats, 'chapter1');
        expect(result.chapter1).toEqual([{ correct: 0, total: 0, rate: '0%' }]);
      });
    });
  
    describe('updateLastStatistic', () => {
      it('should update the last statistic of a chapter', () => {
        const initialStats = { chapter1: [{ correct: 1, total: 2, rate: '50%' }] };
        const result = updateLastStatistic(initialStats, 'chapter1', true, { correct: 1, total: 2 });
        expect(result.chapter1[0]).toEqual({ correct: 2, total: 3, rate: '67%' });
      });
    });
  
    describe('calculateNewCorrectRates', () => {
      it('should calculate new correct rates', () => {
        const prevRates = { correct: 1, total: 2, rate: '50%' };
        const result = calculateNewCorrectRates(prevRates, true);
        expect(result).toEqual({ correct: 2, total: 3, rate: '67%' });
      });
    });
  
    describe('getLastStatistic', () => {
      it('should get the last statistic of a chapter', () => {
        const stats = { chapter1: [{ correct: 1, total: 2, rate: '50%' }, { correct: 2, total: 3, rate: '67%' }] };
        const result = getLastStatistic(stats, 'chapter1');
        expect(result).toEqual({ correct: 2, total: 3, rate: '67%' });
      });
  
      it('should return default values if no statistics exist', () => {
        const stats = {};
        const result = getLastStatistic(stats, 'chapter1');
        expect(result).toEqual({ correct: 0, total: 0, rate: '0%' });
      });
    });
  });