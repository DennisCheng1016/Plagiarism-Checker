const postSinglePDF = async(req, res) => {
    console.log("postSinglePDF")
    try{
        let file = req.files.file;
        let fileName = file.name;
        console.log(fileName);

        file.mv("./raw/"+fileName, function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send("File uploaded");
            }
        })
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

const getSingleTXT = async(req, res) => {
    console.log("getSingleTXT")
    try{
        let file = `./result/sample.txt`;
        res.download(file);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
}

module.exports = {
    postSinglePDF,
    getSingleTXT
}