const express = require('express');
const app = express();

app.get('/movies', (req, res) => {
    res.json(topMovies);
  });

app.get('/', (req, res) => {
    res.send('Welcome to MyFlix!');
});

