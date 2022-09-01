const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const app = express();
const bodyParser = require("body-parser");
const methodOverride = require('method-override');

let topMovies = [
  {
    title: 'Iron Man',
    director: 'Jon Favreau'
  },
  {
    title: 'The Incredible Hulk',
    director: 'Louis Leterrier'
  },
  {
    title: 'Iron Man 2',
    director: 'Jon Favreau'
  }
];

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.get("/movies", (req, res) => {
  res.json(topMovies);
});

app.get("/", (req, res) => {
  res.send("Welcome to MyFlix!");
});

app.get("/documentation.html", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.use("/documentation.html", express.static("public"));

app.use(bodyParser.urlencoded({extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
