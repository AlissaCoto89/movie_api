const express = require("express");
const app = express();

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.get("/", (req, res) => {
  res.send("Welcome to MyFlix!");
});

app.get('/documentation.html', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.use("/documentation.html", express.static("public"));

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
