const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// CREATE SCHEMA
const AuthorSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    bio: String,
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
});

// CREATE MODEL
const Author = mongoose.model("Author", AuthorSchema);

// EXPORT THE MODEL
module.exports = Author;
