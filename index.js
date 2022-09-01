const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const app = express();
const bodyParser = require("body-parser");
const methodOverride = require('method-override');

let top10Movies = [
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
  },
  {
    title: 'Thor',
    director: 'Kenneth Branagh'
  },
  { 
    title: 'Captain America: The First Avenger',
    director: 'Joe Johnston'
  },
  {
    title: 'The Avengers',
    director: 'Joss Whedon'
  },
  {
    title: 'Iron Man 3',
    director: 'Shane Black'
  },
  {
    title: 'Thor: The Dark World',
    director: 'Alan Taylor'
  },
  {
    title: 'Captain America: The Winter Soldier',
    director: 'Anthony Russo'
  },
  {
    title: 'Guardians of the Galaxy',
    director: 'James Gunn'
  }
];

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res) => {
  res.send("Welcome to MyFlix!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(top10Movies);
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
