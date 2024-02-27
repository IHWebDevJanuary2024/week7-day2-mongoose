const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    year: Number,
    codeISBN: { type: String, maxlength: 13, unique: true },
    quantity: { type: Number, min: 0, default: 0 },
    lastPublished: { type: Date, default: Date.now },
    genre: { type: String, enum: ["romance", "fiction", "biography", "poetry"] },
    author: {                                           // <== UPDATE
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author" // "Author" is the model to which we are creating a reference relationship
    }
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;