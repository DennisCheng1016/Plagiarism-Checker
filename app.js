const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require("express-fileupload");
require('dotenv').config();
// console.log(process.env)

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

const port = process.env.PORT || 8888;

const fileRouter = require("./routes/fileRouter.js");

app.get("/", (req, res) => {
    res.send("SC-Quokka presents");
});

app.use("/file", fileRouter);

app.listen(port, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ port);
    else 
        console.log("Error occurred, server can't start", error);
    }
);