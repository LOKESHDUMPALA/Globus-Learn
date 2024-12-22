import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


const shuffleArray = (array) => {
  return array
    .map((item) => ({ value: item, sortOrder: Math.random() }))
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ value }) => value);
};

function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timerValue, setTimerValue] = useState(0);

  
  useEffect(() => {
    if (location.state && location.state.questions) {
      const shuffledQuestions = shuffleArray(location.state.questions).map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }));
      setQuestions(shuffledQuestions);
    }
  }, [location.state]);

  // Timer for counting seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerValue((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle answer selection
  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: selectedOption }));
  };

  
  const handleSubmit = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += 1;
      }
    });
    navigate('/results', { state: { score, total: questions.length, questions } });
  };

  if (questions.length === 0) {
    return <p>Loading questions...</p>;
  }

  
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="p-8 bg-gradient-to-br from-teal-500 via-blue-600 to-purple-700 min-h-screen flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-6 text-center text-white animate-fade-in">
        Quiz Time! 🚀
      </h2>
      <div className="mb-6 w-full max-w-md">
    
        <p className="text-lg font-semibold mb-2 text-center text-white">
          Timer : {formatTime(timerValue)}
        </p>
        <div
          className="h-2 bg-gray-200 rounded-full overflow-hidden"
          style={{ width: '100%' }}
        >
          <div
            className="h-full bg-green-400 transition-all duration-300 ease-in-out"
            style={{ width: `${(timerValue % 60) * 1.67}%` }}
          ></div>
        </div>
      </div>

      <div
        key={currentQuestionIndex}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black animate-slide-in"
      >
        <div className="mb-6">
          <p className="text-xl font-semibold mb-4">
            {questions[currentQuestionIndex].question}
          </p>
          <div className="space-y-2">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <label
                key={index}
                className={`block p-3 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                  answers[currentQuestionIndex] === option
                    ? 'bg-blue-500 text-white border-blue-600'
                    : 'hover:bg-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option}
                  onChange={() => handleAnswerChange(currentQuestionIndex, option)}
                  checked={answers[currentQuestionIndex] === option}
                  className="hidden"
                />
                <span className="ml-2">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-4">
          {currentQuestionIndex < questions.length - 1 && (
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) =>
                  prev === questions.length - 1 ? prev : prev + 1
                )
              }
              className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-orange-500"
            >
              Next
            </button>
          )}
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-purple-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
