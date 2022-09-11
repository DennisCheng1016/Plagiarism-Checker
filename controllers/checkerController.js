const { exec } = require("child_process");

const postCheckConfig = async(req, res) => {
    try{
        // [Placeholder] Retrieve files in buffer, rename them and cache them in folder
        // [Placeholder] Retrieve files in selected database and cache them in folder
        res.status(200).send("success");
        let userID = "[userID]";
        let batchID = "[batchID]"
        initiateCheck(userID + '_' + batchID);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

function initiateCheck(resultID) {
    exec(`./sim_3_0_2/sim_text -R batch / old`, (error, stdout, stderr) => storeResult(stdout));
}

async function storeResult(resultStr) {
    // [Placeholder]store the result into database
    console.log(resultStr);
}



module.exports = {
    postCheckConfig
}