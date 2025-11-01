
import React from 'react';

interface GameOverModalProps {
  score: number;
  onPlayAgain: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, onPlayAgain }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-8 text-center shadow-2xl animate-fade-in-up">
        <h2 className="text-4xl font-bold text-cyan-400 mb-4">Game Over!</h2>
        <p className="text-lg text-slate-300 mb-2">Your final score is:</p>
        <p className="text-5xl font-bold text-white mb-8">{score}</p>
        <button
          onClick={onPlayAgain}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xl font-bold transition-transform transform hover:scale-105"
        >
          Play Again
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameOverModal;
