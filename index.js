const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.use("/documentation.html", express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

let users = [
  {
    id: 1,
    name: "Brielle",
    favoriteMovies:[]
  },
  {
    id: 2,
    name: "Grayson",
    favoriteMovies:["Iron Man"]
  },
];

let movies = [
  {
    Title: "Iron Man",
    Genre: { Name: "Science Fiction" },
    Director: { Name: "Jon Favreau" },
  },
  {
    Title: "The Incredible Hulk",
    Genre: { Name: "Thriller" },
    Director: { Name: "Louis Leterrier" },
  },
  {
    Title: "Iron Man 2",
    Genre: { Name: "Superhero" },
    Director: { Name: "Jon Favreau" },
  },
  {
    Title: "Thor",
    Genre: { Name: "Fantasy" },
    Director: { Name: "Kenneth Branagh" },
  },
  {
    Title: "Captain America: The First Avenger",
    Genre: {
      Name: "Superhero",
    },
    Director: { Name: "Joe Johnston" },
  },
  {
    Title: "The Avengers",
    Genre: { Name: "Action" },
    Director: { Name: "Joss Whedon" },
  },
  {
    Title: "Iron Man 3",
    Genre: { Name: "Comedy" },
    Director: { Name: "Shane Black" },
  },
  {
    Title: "Thor: The Dark World",
    Genre: { Name: "Science Fiction" },
    Director: { Name: "Alan Taylor" },
  },
  {
    Title: "Captain America: The Winter Soldier",
    Genre: {
      Name: "Action",
    },
    Director: { Name: "Anthony Russo" },
  },
  {
    Title: "Guardians of the Galaxy",
    Genre: {
      Name: "Science Fiction",
    },
    Director: { Name: "James Gunn" },
  },
];

app.get("/", (req, res) => {
  res.send("Welcome to MyFlix!");
});

app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

app.get("/movies", (req, res) => {
  res.json(movies);
});

app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);
  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("no such movie!");
  }
});

app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName).Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("no such genre!");
  }
});

app.get("/movies/director/:directorName", (req, res) => {
  const { directorName } = req.params;
  const director = movies.find(
    (movie) => movie.Director.Name === directorName
  ).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send("no such director!");
  }
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  if (newUser.name) {
    newUser.id = uuid.v4();
    res.status(201).json(newUser);
  } else {
    res.status(400).send("users need names!");
  }
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updateUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updateUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("no such user!");
  }
});

app.post("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;
  const updateUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has been added to user ${id} array!`);
  } else {
    res.status(400).send("no such user!");
  }
});

app.delete("/users/:id/:movieTitle", (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.favoriteMovies = user.favoriteMovies.filter(
      (title) => title !== movieTitle
    );
    res
      .status(200)
      .send(`${movieTitle} has been removed from user ${id} array!`);
  } else {
    res.status(400).send("no such user!");
  }
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  let user = users.find((user) => user.id == id);

  if (user) {
    users = users.filter((user) => user.id != id);
    res.status(200).send(`user ${id} has been deleted!`);
  } else {
    res.status(400).send("no such user!");
  }
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
