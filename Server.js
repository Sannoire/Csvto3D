const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.post('/submit', (req, res) => {
  const data = req.body.text; 
  console.log('Полученная строка:', data);
  res.send('Успешно');  
});

app.get('/figures.csv', (req, res) => {
  const filePath = path.join(__dirname, 'figures.csv');
  res.sendFile(filePath);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});