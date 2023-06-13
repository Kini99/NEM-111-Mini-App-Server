const express = require("express");
const { connection } = require("./db");
const { userRouter } = require("./routes/user.routes");
const {notesRouter}=require("./routes/notes.route");
const cors=require("cors");
require("dotenv").config()

const app = express();
app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/notes", notesRouter);

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log(`Server is running at port ${process.env.port} and connected to DB`)
    } catch (err) {
        console.log(err.message)
    }
})
