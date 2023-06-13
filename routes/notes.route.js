const express = require("express");
const { NoteModel } = require("../models/note.model");
const { auth } = require("../middlewares/auth.middleware");

const notesRouter = express.Router();

notesRouter.use(auth);

notesRouter.post("/create", async (req, res) => {
    try {
        const note = new NoteModel(req.body);
        await note.save();
        res.json({ msg: "New note has been added", note: req.body });
    } catch (err) {
        res.json({ error: err.message });
    }
})

notesRouter.get("/", async (req, res) => {
    try {
        const notes = await NoteModel.find({ userID: req.body.userID });
        res.send(notes);
    } catch (err) {
        res.json({ error: err.message });
    }
})

notesRouter.patch("/update/:noteID", async (req, res) => {
    //userID in the user doc===userID in the note doc
    const userIDinUserDoc = req.body.userID;
    const { noteID } = req.params;
    try {
        const note = await NoteModel.find({ _id: noteID })
        const userIDinNoteDoc = note[0].userID;
        if (userIDinUserDoc === userIDinNoteDoc) {
            await NoteModel.findByIdAndUpdate({ _id: noteID }, req.body)
            res.json({ msg: `${note.title} has been updated` })
        } else {
            res.json({ msg: "Not Authorized!" })
        }
    } catch (err) {
        res.json({ err: err.message });
    }
})

notesRouter.delete("/delete/:noteID", async (req, res) => {
    const userIDinUserDoc = req.body.userID;
    const { noteID } = req.params;
    try {
        const note = await NoteModel.find({ _id: noteID })
        const userIDinNoteDoc = note[0].userID;
        if (userIDinUserDoc === userIDinNoteDoc) {
            await NoteModel.findByIdAndDelete({ _id: noteID })
            res.json({ msg: `${note[0].title} has been updated` })
        } else {
            res.json({ msg: "Not Authorized!" })
        }
    } catch (err) {
        res.json({ err: err.message });
    }
})

module.exports = {
    notesRouter
}
