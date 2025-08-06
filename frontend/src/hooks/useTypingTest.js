import { useState, useEffect, useCallback, useRef } from 'react';
import { generate } from 'random-words';



// const getRandomWords = (count) => {
//   const commonWords = [
//     'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
//     'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
//     'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
//     'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
//     'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
//     'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
//     'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
//     'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
//     'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
//     'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day',
//     'most', 'us', 'is', 'water', 'long', 'find', 'here', 'thing', 'great', 'man',
//     'world', 'life', 'still', 'hand', 'high', 'right', 'move', 'too', 'old', 'same',
//     'tell', 'boy', 'follow', 'came', 'want', 'show', 'also', 'around', 'farm', 'three',
//     'small', 'set', 'put', 'end', 'why', 'again', 'turn', 'every', 'should', 'another',
//     'think', 'where', 'help', 'through', 'much', 'before', 'line', 'right', 'too', 'means',
//     'old', 'any', 'same', 'tell', 'boy', 'follow', 'came', 'want', 'show', 'also',
//     'around', 'farm', 'three', 'small', 'set', 'put', 'end', 'why', 'again', 'turn',
//     'every', 'should', 'another', 'think', 'where', 'help', 'through', 'much', 'before'
//   ];
//   const words = [];
//   for (let i = 0; i < count; i++) {
//     words.push(commonWords[Math.floor(Math.random() * commonWords.length)]);
//   }
//   return words;
// };





 // Generate an array of random words
const getRandomWords = (count) => generate({ exactly: count });
  

const calculateWPM = (correctChars, timeElapsed) => {
  if (timeElapsed === 0) return 0;
  const minutes = timeElapsed / 60;
  const wordsTyped = correctChars / 5;
  return Math.round(wordsTyped / minutes);
};

const calculateAccuracy = (correctChars, totalChars) => {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
};

const calculateRawWPM = (totalChars, timeElapsed) => {
  if (timeElapsed === 0) return 0;
  const minutes = timeElapsed / 60;
  const wordsTyped = totalChars / 5;
  return Math.round(wordsTyped / minutes);
};

export const useTypingTest = (duration = 60) => {
  const [words, setWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState(0);
  const [wordStates, setWordStates] = useState([]);
  const [charStates, setCharStates] = useState([]);

  const timerRef = useRef(null);
  const testDuration = useRef(duration);

  const initializeTest = useCallback(() => {
    const newWords = getRandomWords(200); // Generate 200 words initially
    setWords(newWords);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setInput('');
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(testDuration.current);
    setIsActive(false);
    setIsFinished(false);
    setCorrectChars(0);
    setIncorrectChars(0);
    setCorrectWords(0);
    setIncorrectWords(0);

    const newWordStates = newWords.map(() => 'pending');
    const newCharStates = newWords.map(word => Array(word.length).fill('pending'));
    setWordStates(newWordStates);
    setCharStates(newCharStates);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const startTest = useCallback(() => {
    if (!isActive && !isFinished) {
      const now = Date.now();
      setStartTime(now);
      setIsActive(true);

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            setIsFinished(true);
            setEndTime(Date.now());
            clearInterval(timerRef.current);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  }, [isActive, isFinished]);

  const handleInput = useCallback((char) => {
    if (isFinished || !words.length) return;

    if (!isActive) {
      startTest();
    }

    const currentWord = words[currentWordIndex];
    if (!currentWord) return;

    if (char === ' ') {
      const isWordCorrect = input === currentWord;

      setWordStates(prev => {
        const newStates = [...prev];
        newStates[currentWordIndex] = isWordCorrect ? 'correct' : 'incorrect';
        return newStates;
      });

      if (isWordCorrect) {
        setCorrectWords(prev => prev + 1);
        setCorrectChars(prev => prev + currentWord.length + 1);
      } else {
        setIncorrectWords(prev => prev + 1);
        setIncorrectChars(prev => prev + Math.max(input.length, currentWord.length) + 1);
      }

      // Add more words when getting close to the end
      if (currentWordIndex > words.length - 50) {
        const newWords = getRandomWords(200);
        setWords(prev => [...prev, ...newWords]);
        setWordStates(prev => [...prev, ...newWords.map(() => 'pending')]);
        setCharStates(prev => [...prev, ...newWords.map(word => Array(word.length).fill('pending'))]);
      }

      setCurrentWordIndex(prev => prev + 1);
      setCurrentCharIndex(0);
      setInput('');

    } else if (char === 'Backspace') {
      if (input.length > 0) {
        const newInput = input.slice(0, -1);
        setInput(newInput);
        setCurrentCharIndex(newInput.length);

        setCharStates(prev => {
          const newStates = [...prev];
          if (newStates[currentWordIndex]) {
            newStates[currentWordIndex][input.length - 1] = 'pending';
          }
          return newStates;
        });
      }
    } else {
      const newInput = input + char;
      setInput(newInput);

      const isCorrect = char === currentWord[currentCharIndex];

      setCharStates(prev => {
        const newStates = [...prev];
        if (newStates[currentWordIndex]) {
          newStates[currentWordIndex][currentCharIndex] = isCorrect ? 'correct' : 'incorrect';
        }
        return newStates;
      });

      setCurrentCharIndex(prev => prev + 1);
    }
  }, [words, currentWordIndex, currentCharIndex, input, isActive, isFinished, startTest]);

  const getStats = useCallback(() => {
    const timeElapsed = startTime ? Math.max(1, testDuration.current - timeLeft) : 0;
    const totalChars = correctChars + incorrectChars;

    return {
      wpm: calculateWPM(correctChars, timeElapsed),
      rawWpm: calculateRawWPM(totalChars, timeElapsed),
      accuracy: calculateAccuracy(correctChars, totalChars),
      correctWords,
      incorrectWords,
      timeElapsed,
      totalChars
    };
  }, [correctChars, incorrectChars, correctWords, incorrectWords, startTime, timeLeft]);

  const setTestDuration = useCallback((newDuration) => {
    testDuration.current = newDuration;
    setTimeLeft(newDuration);
  }, []);

  useEffect(() => {
    initializeTest();
  }, [initializeTest]);

  useEffect(() => {
    if (words.length > 0) {
      setWordStates(prev => {
        const newStates = [...prev];
        newStates[currentWordIndex] = 'current';
        return newStates;
      });
    }
  }, [currentWordIndex, words.length]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    words,
    currentWordIndex,
    currentCharIndex,
    input,
    timeLeft,
    isActive,
    isFinished,
    wordStates,
    charStates,
    handleInput,
    getStats,
    initializeTest,
    setTestDuration,
    testDuration: testDuration.current
  };
};