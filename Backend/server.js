
const express = require('express');
const cors = require('cors'); 
const mongoose  = require('mongoose');
const route = require('./routes/quizz-routes'); 
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.3/quizz", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST','PUT','PATCH'], 
  allowedHeaders: ['Content-Type'],
}));


app.use('/api/quiz', route);


const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
