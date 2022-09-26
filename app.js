const express = require('express');
const authRouter = require('./routes/authRouter');
const verifyToken = require('./middlewares/verifyToken').verifyToken;
const cors = require('cors');
const fileUpload = require("express-fileupload");
const fileRouter = require("./routes/fileRouter");
const checkerRouter = require("./routes/checkerRouter");
const resultRouter = require("./routes/resultRouter");
const subjectRouter = require("./routes/subjectRouter");
const assignmentRouter = require("./routes/assignmentRouter");
const bufferFileRouter = require("./routes/bufferFileRouter")
const userRouter = require("./routes/userRouter");
const adminRouter = require('./routes/adminRouter');
const { default: mongoose } = require('mongoose');
const connectDB = require('./Config/connectMongo');
require('dotenv').config();
// console.log(process.env)

//connect to database
connectDB();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

const port = process.env.PORT || 8888;

app.get("/", (req, res) => {
    res.send("SC-Quokka presents");
});

app.use("/auth", authRouter);
app.use(verifyToken);
app.use("/user",userRouter);
app.use("/file", fileRouter);
app.use("/check", checkerRouter);
app.use("/result", resultRouter);
app.use("/subject",  subjectRouter);
app.use("/assignment",  assignmentRouter);
app.use("/buffer",  bufferFileRouter);
app.use("/admin", adminRouter);

mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB");
    app.listen(port, (error) => {
        if (!error)
            console.log("Server is Successfully Running, and App is listening on port " + port);
        else
            console.log("Error occurred, server can't start", error);
    }
    );
});

