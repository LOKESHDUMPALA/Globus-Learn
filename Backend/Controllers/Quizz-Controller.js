
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Questions = require("../models/QnsModel"); 
const { GoogleGenerativeAI } = require('@google/generative-ai');


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


const parseQuestions = (questionsText) => {
  const cleanText = questionsText.replace(/\s+/g, ' ').trim();
  
  // Regex to match question blocks
  const questionRegex = /\*\*\d+\.\s*(.+?)\*\*\s*a\)\s*(.+?)\s*b\)\s*(.+?)\s*c\)\s*(.+?)\s*d\)\s*(.+?)\s*\*\*Correct Answer:\s*[a-d]\)\s*(.+?)(?=\s*\*\*\d+\.|$)/gi;

  const parsedQuestions = [];
  let match;

  while ((match = questionRegex.exec(cleanText)) !== null) {
    const [_, question, optA, optB, optC, optD, correct] = match;
    const cleanCorrectAnswer = correct.replace(/\*\*$/, '').trim();

    parsedQuestions.push({
      question: question.trim(),
      options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
      correctAnswer: cleanCorrectAnswer,
    });
  }

  return parsedQuestions;
};


const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please provide a PDF file.' });
    }

    const dataBuffer = req.file.buffer;

    const pdfData = await pdfParse(dataBuffer);
    const textContent = pdfData.text.trim();

    if (textContent.length < 10) {
      return res.status(400).json({ error: 'The PDF does not contain sufficient content to generate questions.' });
    }

    const jsonContent = {
      text: textContent,
      source: 'PDF',
    };

  
    const prompt = `From the following content, generate multiple-choice questions with four options (a, b, c, d), and the correct answer labeled. Generate questions based on the actual content in the text: ${JSON.stringify(jsonContent)}`;

  
    const genAI = new GoogleGenerativeAI('AIzaSyCtVPCQxq6mO-5FlrPYdlIPt7Mu_wX7v4c');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Generate questions using Gemini-api
    const result = await model.generateContent(prompt);
    const questionsText = result.response?.candidates[0]?.content?.parts[0]?.text;

    if (!questionsText) {
      return res.status(500).json({ error: 'Failed to generate questions from the AI response.' });
    }

    // Parse questions into the model format
    const questions = parseQuestions(questionsText);

    await Questions.deleteMany({});
    await Questions.insertMany(questions);

  
    res.json({ success: true, questions });
  } catch (error) {
    console.error('Error uploading PDF:', error.message);
    res.status(500).json({ error: 'An error occurred while processing the PDF.' });
  }
};

module.exports = { uploadPDF, upload };
