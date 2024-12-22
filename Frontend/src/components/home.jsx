import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    try {
    
      const response = await axios.post('http://localhost:5000/api/quiz/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        
        navigate('/quiz', { state: { questions: response.data.questions } });
      } else {
        alert('Failed to generate questions');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Error uploading PDF.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-purple-800 mb-6 animate-fade-in">
          🚀 Start Your Quiz Adventure!
        </h1>
        <p className="text-lg text-center text-gray-700 mb-6">
          Upload a PDF document to generate quiz questions. Simply upload your content, and let us handle the rest!
        </p>

        <div className="flex flex-col items-center mb-6">
          <label htmlFor="pdf-upload" className="text-xl font-semibold text-purple-600 mb-3">
            Choose Your PDF
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="p-3 border-2 border-purple-500 rounded-lg mb-4 file:cursor-pointer file:border-none file:rounded-lg file:bg-purple-500 file:text-white"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 text-xl font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Start Quiz
        </button>
      </div>

      <footer className="absolute bottom-4 text-center w-full text-white">
        <p className="text-sm">© 2024 Quiz Master. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
