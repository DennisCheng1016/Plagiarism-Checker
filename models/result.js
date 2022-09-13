// require mongoose module
const mongoose = require("mongoose")

/* -------------------------------------- MODEL -------------------------------------- */
const resultSchema = new mongoose.Schema({

    fileName: {
        type: String,
        required: true
    },
    checker : {
        type: String,
        required: true
    },
    similarity: {
        type: Number,
        required: true,
        default : 0
    },
    duplicates: {
        type: [[Number]],
        required: false,
        default : [[]]
    },
    when: {
        type: Date,
        required: true,
        default: Date.now()
    },
    textContent : {
        type: String,
        required: true
    },
    originalFile: {
        type: Buffer,
        required: true
    }
})


const Result = mongoose.model("Result", resultSchema)

module.exports = Result