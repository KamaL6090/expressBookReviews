const express = require("express");
const public_users = express.Router();
const axios = require("axios");
const { books } = require("./books.js");

// Task 1
public_users.get("/", (req, res) => {
  res.send(JSON.stringify(books, null, 2));
});

// Task 2
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Task 3
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author;
  const result = Object.values(books).filter(book => book.author === author);
  res.send(result);
});

// Task 4
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title;
  const result = Object.values(books).filter(book => book.title === title);
  res.send(result);
});

// Task 5
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10
public_users.get("/async/books", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:5000/");
    res.send(response.data);
  } catch (err) {
    res.status(500).send("Error fetching books");
  }
});

// Task 11
public_users.get("/promise/isbn/:isbn", (req, res) => {
  axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(response => res.send(response.data))
    .catch(err => res.status(500).send("Error"));
});

// Task 12
public_users.get("/async/author/:author", async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    res.send(response.data);
  } catch {
    res.status(500).send("Error");
  }
});

// Task 13
public_users.get("/promise/title/:title", (req, res) => {
  axios.get(`http://localhost:5000/title/${req.params.title}`)
    .then(response => res.send(response.data))
    .catch(() => res.status(500).send("Error"));
});

module.exports.public_users = public_users;
