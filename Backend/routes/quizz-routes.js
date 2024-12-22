// routes.js
const express = require('express');
const { uploadPDF, upload } = require('../Controllers/Quizz-Controller'); 

const router = express.Router();


router.post('/upload', upload.single('pdf'), uploadPDF);

module.exports = router;
