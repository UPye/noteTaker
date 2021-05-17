// Defining constants needed to run the server
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


// GET request renders notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});


// GET the rendered notes plus any new notes
app.get("/api/notes", (req, res) => {
  res.send(fs.readFileSync("./db/db.json", "utf8"));
});


// GET renders the the index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});


// POST to create new notes
app.post("/api/notes", (req, res) => {
  let newNote = req.body;
  newNote.id = uuid();
  saveNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  saveNotes.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(saveNotes)
  );
  res.json(newNote);
});


// DELETE note by ID and update db.json
app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id.toString();
    console.log(id, "ID posted!");
    let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    const updatedNotes = data.filter( note => note.id.toString() !== id );
    fs.writeFileSync("./db/db.json", JSON.stringify(updatedNotes));

    res.json(updatedNotes);
});


// Initiates server and triggers listeners for front-end requests on port defined in documentation
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});