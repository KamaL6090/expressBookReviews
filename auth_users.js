const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const { books } = require("./books.js");

const authenticated = express.Router();
let users = [];

authenticated.use(bodyParser.json());

const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Task 6
authenticated.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing username or password");

  if (isValid(username)) {
    return res.status(409).send("User already exists");
  }

  users.push({ username, password });
  res.send("User registered successfully");
});

// Task 7
authenticated.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).send("Invalid credentials");

  const token = jwt.sign({ username }, "secret", { expiresIn: "1h" });
  res.send({ message: "Login successful", token });
});

// Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).send("Authorization header missing");

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).send("Token missing");

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

// Task 8
authenticated.put("/review/:isbn", verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;

  if (!review) return res.status(400).send("Review content missing");

  books[isbn].reviews[username] = review;
  res.send("Review added/updated");
});

// Task 9
authenticated.delete("/review/:isbn", verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    res.send("Review deleted");
  } else {
    res.status(404).send("Review not found");
  }
});

module.exports.authenticated = authenticated;
