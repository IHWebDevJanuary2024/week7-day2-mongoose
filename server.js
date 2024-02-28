// ----- REQUIRES 👇

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const Book = require("./models/Book.model");
const Author = require("./models/Author.model");

require("dotenv").config();

const PORT = process.env.PORT;

const server = express();

// ----- MIDDLEWARES 👇
server.use(express.json());
server.use(morgan("dev"));

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

const MONGODB_URL = process.env.MONGODB_URL;

// ----- MONGOOSE CONNECTION 👇
mongoose
    .connect(MONGODB_URL)
    .then(response => console.log(`Connected to Mongo! Database name: "${response.connections[0].name}"`))
    .catch(err => console.error("Error connecting to mongo", err));

// ----- BOOK ROUTES 👇
server.post("/books/:authorID", (req, res) => {
    console.log(req.body);

    const { title, quantity, codeISBN, year, genre } = req.body; // destructuring rules!

    Book.create({
        title,
        quantity,
        author: req.params.authorID,
        codeISBN,
        year,
        genre
    })
        .then((createdBook) => {
            console.log("Book created ->", createdBook);
            return Author.findByIdAndUpdate(req.params.authorID, { $push: { books: createdBook._id } })
        })
        .then((response => {
            console.log(response)
            res.status(201).json(response);
        }))
        .catch((error) => {
            console.error("Error while creating the book ->", error);
            res.status(500).json({ error: "Failed to create the book" });
        });
});

server.get("/books", (req, res) => {
    console.log("req.query -> ", req.query);

    Book.find(req.query) // too generic... but for now it works...
        .populate("author") // this is going to fill the author object
        .then(arrayOfBooks => res.status(200).json(arrayOfBooks))
        .catch((error) => {
            console.error("Error while retrieving the book ->", error);
            res.status(500).json({ error: "Failed to get books" });
        });
})



server.put("/books", (req, res) => {
    Book.updateMany({ "author": "Terminator J.K. Rowling" }, { "author": "J.K. Roboling" })
        .then(arrayOfBooks => res.status(200).json(arrayOfBooks))
        .catch((error) => {
            console.error("Error while updating the book ->", error);
            res.status(500).json({ error: "Failed to update book" });
        });
})

server.delete("/books", (req, res) => {

    /* Book.findByIdAndDelete(req.body.id)
    .then(response => res.status(200).json(response))
    .catch((error) => {
        console.error("Error while deleting the book ->", error);
        res.status(500).json({ error: "Failed to delete the book" });
    }); */
    Book.deleteMany()
        .then(response => res.status(200).json(response))
        .catch((error) => {
            console.error("Error while deleting the book ->", error);
            res.status(500).json({ error: "Failed to delete the book" });
        });
})


// ----- AUTHOR ROUTES 👇
server.post("/authors", (req, res) => {

    const { firstName, lastName, bio } = req.body;

    Author.create({
        firstName,
        lastName,
        bio
    })
        .then(response => res.status(200).json(response))
        .catch((error) => {
            console.error("Error while creating author ->", error);
            res.status(500).json({ error: "Failed to create author" });
        });
})

server.get("/authors", (req, res) => {
    Author.find()
        .populate("books")
        .then(response => res.status(200).json(response))
        .catch((error) => {
            console.error("Error while searching author ->", error);
            res.status(500).json({ error: "Failed to searching author" });
        });

})

server.get("/authors/:authorID", (req, res) => {
    console.log("req.params ", req.params);

    Author.findById(req.params.authorID)
        .then(response => res.status(200).json(response))
        .catch((error) => {
            console.error("Error while searching author ->", error);
            res.status(500).json({ error: "Failed to search author" });
        });

})

