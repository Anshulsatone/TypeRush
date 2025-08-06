import React from 'react';
import { RotateCcw, Trophy, Target, Zap } from 'lucide-react';

const Results = ({ stats, onRestart, testDuration }) => {
  const getPerformanceLevel = (wpm, accuracy) => {
    if (wpm >= 70 && accuracy >= 95) return { level: 'Excellent', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900' };
    if (wpm >= 50 && accuracy >= 90) return { level: 'Great', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900' };
    if (wpm >= 30 && accuracy >= 85) return { level: 'Good', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900' };
    return { level: 'Keep Practicing', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-800' };
  };

  const performance = getPerformanceLevel(stats.wpm, stats.accuracy);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Test Complete!</h2>
          </div>
          <div className={`inline-block px-4 py-2 rounded-full ${performance.bg}`}>
            <span className={`text-lg font-semibold ${performance.color}`}>
              {performance.level}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Words Per Minute</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.wpm}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Raw WPM: {stats.rawWpm}
            </div>
          </div>
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Accuracy</span>
            </div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {stats.accuracy}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stats.totalChars} characters
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {stats.correctWords}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Correct Words</div>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-1">
              {stats.incorrectWords}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">Wrong Words</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {testDuration}s
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Test Duration</div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onRestart}
            className="inline-flex items-center px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;