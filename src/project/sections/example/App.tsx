import { useState } from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-pulse">
          Hello World
        </h1>
        <Counter />
      </div>
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleIncrement = () => {
    setIsAnimating(true);
    setCount(count + 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20 transform transition-all duration-300 hover:scale-105">
      <div className="space-y-6">
        <div className="text-sm uppercase tracking-wider text-purple-300 font-semibold">
          Interactive Counter
        </div>
        <div className={`text-8xl md:text-9xl font-black text-white transition-all duration-300 ${
          isAnimating ? 'scale-125 rotate-12' : 'scale-100 rotate-0'
        }`}>
          {count}
        </div>
        <button
          className="cursor-pointer group relative px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-110 hover:shadow-2xl active:scale-95 overflow-hidden"
          onClick={handleIncrement}
        >
          <span className="relative z-10 flex items-center gap-2">
            <span>Increment</span>
            <svg className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>
      </div>
    </div>
  );
}
