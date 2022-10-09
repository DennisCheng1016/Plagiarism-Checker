// require mongoose module
const mongoose = require("mongoose")

/* -------------------------------------- MODEL -------------------------------------- */
const permissionSchema = new mongoose.Schema({
    email: {
        type: String, required: true, unique: true
    }
});


const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
