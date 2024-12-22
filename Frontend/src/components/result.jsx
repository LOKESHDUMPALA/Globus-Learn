import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, questions } = location.state;

  const handleRetry = () => {
    navigate('/quiz', { state: { questions } });
  };

  return (
    <div className="p-8 bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 min-h-screen flex flex-col items-center justify-center">
      
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
      
        <h2 className="text-4xl font-extrabold text-purple-600 mb-6 animate-bounce">
          🎉 Quiz Completed!
        </h2>
    
        <p className="text-2xl font-semibold text-gray-700 mb-4">
          Your Score: <span className="text-green-500">{score}</span> /{' '}
          <span className="text-blue-500">{total}</span>
        </p>
        <p className="text-sm text-gray-500 italic mb-6">
          Great job! But can you do even better?
        </p>
      
        <button
          onClick={handleRetry}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-full font-medium shadow-lg transform transition-all duration-300 ease-out hover:scale-110 hover:shadow-2xl"
        >
          Retry Quiz
        </button>
      </div>
    </div>
  );
}

export default Result;
