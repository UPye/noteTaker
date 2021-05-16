const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// GET returns the notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
// GET the /api/notes read JSON file and returns saved notes as JSON
app.get("/api/notes", (req, res) => {
  res.send(fs.readFileSync("./db/db.json", "utf8"));
});
// GET returns the the index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
// POST /api/notes recives new note to save on the request body
// THEN adds to the db.json file and returns new note to client
// ALSO adds a unique ID to each note when saved using UUID
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
// DELETE note and update db.json
app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id.toString();
    console.log(id, "ID posted!");
    let data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    const updatedNotes = data.filter( note => note.id.toString() !== id );
    fs.writeFileSync("./db/db.json", JSON.stringify(updatedNotes));

    res.json(updatedNotes);
});


app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});