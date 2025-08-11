import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 text-gray-800 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-black/20 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 hover:scale-110 group"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <Sun className={`w-6 h-6 absolute transition-all duration-500 ${isDark ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
        <Moon className={`w-6 h-6 absolute transition-all duration-500 ${isDark ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
      </div>
    </button>
  );
};

export default ThemeToggle;