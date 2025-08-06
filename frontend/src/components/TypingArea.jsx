import React, { useEffect, useRef } from 'react';
import { Keyboard, Clock, Target, CheckCircle, XCircle, Zap } from 'lucide-react';

// Stats component is now defined locally
const Stats = ({ stats, timeLeft, testDuration, isActive }) => {
  const progress = ((testDuration - timeLeft) / testDuration) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {isActive && (
        <div className="mb-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-yellow-400 dark:bg-yellow-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-2"><Zap className="w-5 h-5 text-yellow-500 mr-2" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">WPM</span></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.wpm}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-2"><Target className="w-5 h-5 text-blue-500 mr-2" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">Accuracy</span></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.accuracy}%</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-2"><CheckCircle className="w-5 h-5 text-green-500 mr-2" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">Correct</span></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.correctWords}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-2"><XCircle className="w-5 h-5 text-red-500 mr-2" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">Wrong</span></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.incorrectWords}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-2"><Clock className="w-5 h-5 text-purple-500 mr-2" /><span className="text-sm font-medium text-gray-600 dark:text-gray-400">Time</span></div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{timeLeft}s</div>
        </div>
      </div>
    </div>
  );
};

// WordDisplay component is now defined locally
const WordDisplay = ({ words, currentWordIndex, currentCharIndex, charStates, input }) => {
  const getCharClassName = (wordIndex, charIndex) => {
    const baseClass = "transition-all duration-150";

    if (wordIndex === currentWordIndex) {
      if (charIndex === currentCharIndex) {
        return `${baseClass} bg-yellow-400 dark:bg-yellow-500 text-black`;
      }
      if (charIndex < input.length) {
        const isCorrect = charStates[wordIndex]?.[charIndex] === 'correct';
        return `${baseClass} ${isCorrect ? 'text-green-400 dark:text-green-400' : 'text-red-400 dark:text-red-400 bg-red-900/30'}`;
      }
    } else if (wordIndex < currentWordIndex) {
      const isCorrect = charStates[wordIndex]?.[charIndex] === 'correct';
      return `${baseClass} ${isCorrect ? 'text-green-400 dark:text-green-400' : 'text-red-400 dark:text-red-400'}`;
    }
    return `${baseClass} text-gray-500 dark:text-gray-400`;
  };

  const getWordClassName = (wordIndex) => {
    const baseClass = "mr-3 mb-2 inline-block transition-all duration-300";
    if (wordIndex === currentWordIndex) {
      return `${baseClass} transform scale-105`;
    }
    return baseClass;
  };

  return (
    <div className="text-center px-4">
      <div className="text-2xl md:text-3xl leading-relaxed max-w-4xl mx-auto">
        {words.slice(0, 50).map((word, wordIndex) => (
          <span key={wordIndex} className={getWordClassName(wordIndex)}>
            {word.split('').map((char, charIndex) => (
              <span key={charIndex} className={getCharClassName(wordIndex, charIndex)}>
                {char}
              </span>
            ))}
            {wordIndex === currentWordIndex && input.length > word.length && (
              input.slice(word.length).split('').map((char, extraIndex) => (
                <span key={`extra-${extraIndex}`} className="bg-red-900/50 text-red-400 transition-all duration-150">
                  {char}
                </span>
              ))
            )}
          </span>
        ))}
      </div>
    </div>
  );
};


// The main component for this file
const TypingArea = ({ words, currentWordIndex, currentCharIndex, input, charStates, timeLeft, isActive, isFinished, stats, testDuration, onInput, onDurationChange }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.focus();
    }

    const handleKeyPress = (e) => {
      if (isFinished) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === 'Tab') {
        e.preventDefault();
        return;
      }

      if (e.key.length === 1 || e.key === ' ' || e.key === 'Backspace') {
        e.preventDefault();
        onInput(e.key);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFinished, onInput]);

  const durations = [15, 30, 60];

  return (
    <div ref={containerRef} className="w-full max-w-6xl mx-auto focus:outline-none" tabIndex={0}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-6">
          <Keyboard className="w-8 h-8 text-yellow-500 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">TypeSpeed</h1>
        </div>

        {!isActive && !isFinished && (
          <div className="flex justify-center mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700">
              {durations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => onDurationChange(duration)}
                  className={`px-4 py-2 mx-1 rounded-md font-medium transition-all duration-200 ${testDuration === duration ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {duration}s
                </button>
              ))}
            </div>
          </div>
        )}

        {!isActive && !isFinished && (
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Click here and start typing to begin the test
          </p>
        )}
      </div>

      <Stats
        stats={stats}
        timeLeft={timeLeft}
        testDuration={testDuration}
        isActive={isActive}
      />

      <div className="mb-8">
        <WordDisplay
          words={words}
          currentWordIndex={currentWordIndex}
          currentCharIndex={currentCharIndex}
          charStates={charStates}
          input={input}
        />
      </div>

      {!isActive && !isFinished && (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="mb-2">Press any key to start typing</p>
          <p className="text-sm">Use space to move to the next word</p>
        </div>
      )}
    </div>
  );
};

export default TypingArea;