import React, { useState, useEffect } from 'react';
import { useTypingTest } from './hooks/useTypingTest';
import TypingArea from './components/TypingArea';
import Results from './components/Results';
import { Sun, Moon } from 'lucide-react';

// ThemeToggle component is now defined locally
const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};


function App() {
  const [isDark, setIsDark] = useState(true);
  const {
    words,
    currentWordIndex,
    currentCharIndex,
    input,
    timeLeft,
    isActive,
    isFinished,
    charStates,
    handleInput,
    getStats,
    initializeTest,
    setTestDuration,
    testDuration
  } = useTypingTest(60);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);
  const stats = getStats();
  const handleRestart = () => initializeTest();

  const handleDurationChange = (duration) => {
    if (!isActive) {
      setTestDuration(duration);
      initializeTest();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-inter">
      <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />

      <div className="container mx-auto px-4 py-8">
        {isFinished ? (
          <Results
            stats={stats}
            onRestart={handleRestart}
            testDuration={testDuration}
          />
        ) : (
          <TypingArea
            words={words}
            currentWordIndex={currentWordIndex}
            currentCharIndex={currentCharIndex}
            input={input}
            charStates={charStates}
            timeLeft={timeLeft}
            isActive={isActive}
            isFinished={isFinished}
            stats={stats}
            testDuration={testDuration}
            onInput={handleInput}
            onDurationChange={handleDurationChange}
          />
        )}
      </div>

    </div>
  );
}

export default App;