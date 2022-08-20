const express = require('express');
const app = express();
// const mongoose = require('mongoose');

const port = process.env.PORT || 8888;

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ port);
    else 
        console.log("Error occurred, server can't start", error);
    }
);