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
    Description: "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
    Genre: { Name: "Superhero" },
    Director: { Name: "Jon Favreau" },
    ImageURL: "https://www.previewsworld.com/SiteImage/MainImage/STL206028.jpg"
  },
  {
    Title: "Bridesmaids",
    Description: "Competition between the maid of honor and a bridesmaid, over who is the bride's best friend, threatens to upend the life of an out-of-work pastry chef.",
    Genre: { Name: "Comedy" },
    Director: { Name: "Paul Feig"},
    ImageURL: "https://m.media-amazon.com/images/I/71NSaiNKO9L._AC_SL1333_.jpg"
  },
  {
    Title: "The Notebook",
    Description: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.",
    Genre: { Name: "Drama" },
    Director: { Name: "Nick Cassavetes" },
    ImageURL: "https://www.imdb.com/title/tt0332280/mediaviewer/rm1153669376/?ref_=tt_ov_i"
  },
  {
    Title: "Thor",
    Description: "The powerful but arrogant god Thor is cast out of Asgard to live amongst humans in Midgard (Earth), where he soon becomes one of their finest defenders.",
    Genre: { Name: "Superhero" },
    Director: { Name: "Kenneth Branagh" },
    ImageURL: "https://www.imdb.com/title/tt0800369/mediaviewer/rm3272546304/?ref_=tt_ov_i"
  },
  {
    Title: "Pretty Woman",
    Description: "A man in a legal but hurtful business needs an escort for some social events, and hires a beautiful prostitute he meets... only to fall in love.",
    Genre: { Name: "Romantic Comedy" },
    Director: { Name: "Joe Johnston" },
    ImageURL: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTDTHnd0HSjj9GDi8-rOC6vXCvO7J4GqmuNbFjQ58NPrAh_l0p8"
  },
  {
    Title: "The Godfather",
    Description: "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son.",
    Genre: { Name: "Crime" },
    Director: { Name: "Francis Ford Coppola" },
    ImageURL: "https://www.imdb.com/title/tt0068646/mediaviewer/rm746868224/?ref_=tt_ov_i"
  },
  {
    Title: "Twilight",
    Description: "When Bella Swan moves to a small town in the Pacific Northwest, she falls in love with Edward Cullen, a mysterious classmate who reveals himself to be a 108-year-old vampire.",
    Genre: { Name: "Fantasy" },
    Director: { Name: "Catherine Hardwicke" },
    ImageURL: "https://www.imdb.com/title/tt1099212/mediaviewer/rm2266076160/?ref_=tt_ov_i"
  },
  {
    Title: "The Shining",
    Description: "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future.",
    Genre: { Name: "Horror" },
    Director: { Name: "Stanley Kubrick" },
    ImageURL: "https://www.imdb.com/title/tt0081505/mediaviewer/rm3901111552/?ref_=tt_ov_i"
  },
  {
    Title: "Clueless",
    Description: "Shallow, rich and socially successful Cher is at the top of her Beverly Hills high school's pecking scale. Seeing herself as a matchmaker, Cher first coaxes two teachers into dating each other.",
    Genre: { Name: "Comedy" },
    Director: { Name: "Amy Heckerling" },
    ImageURL: "https://www.imdb.com/title/tt0112697/mediaviewer/rm2643037953/?ref_=tt_ov_i"
  },
  {
    Title: "Zoolander",
    Description: "At the end of his career, a clueless fashion model is brainwashed to kill the Prime Minister of Malaysia.",
    Genre: { Name: "Comedy" },
    Director: { Name: "Ben Stiller" },
    ImageURL: "https://www.imdb.com/title/tt0196229/mediaviewer/rm2303908096/?ref_=tt_ov_i"
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
