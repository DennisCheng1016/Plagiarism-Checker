const pdfParse = require("pdf-parse");
const fs = require("fs");
const fsp = require("fs").promises;
const fileBuffer = require("../models/bufferFile");
const path = require("path");
const User = require("../models/user");

let fileName;
let resultText;
const postSinglePDF = async (req, res) => {
  console.log("postSinglePDF");
  try {
    let file = req.files;
    console.log(Object.keys(file));
    Object.keys(file).map((key) => {
      console.log(key);
      console.log(file[key]);
    });
    fileName = path.parse(file.name).name;

    file.mv("./raw/" + fileName, function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        pdfParse(file).then((result) => {
          resultText = result.text;
          fs.writeFile(`./result/${fileName}.txt`, result.text, (err) => {
            if (err) {
              console.error(err);
            } else {
              api_stub(fileName);
              res.status(200).send("File uploaded");
            }
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getSingleTXT = async (req, res) => {
  console.log("getSingleTXT");
  try {
    console.log(`./result/${fileName}.txt`);
    let file = `./result/${fileName}.txt`;
    // let file = './result/risk.txt';
    res.download(file);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

const getMockResult = async (req, res) => {
  console.log("getMockResult");
  try {
    fs.readFile(`./result/mockRate.txt`, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
      result = {
        submissionID: 2,
        submitter: "Bob",
        file: fileName,
        uploadTime: new Date(2022, 4, 12).toDateString(),
        similarity: data,
        PorF: "pass",
        text: resultText,
      };
      res.status(200).send(JSON.stringify(result));
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

function api_stub(fileName) {
  fs.writeFile(`./result/mockRate.txt`, "10%", function (err) {
    if (err) throw err;
    console.log("Saved!");
  });
}

const uploadFiles = async (req, res) => {
  try {
    if (!req.files) return res.status.json({ msg: "No upload files" });
    const files = req.files.file;
    const subjectCode = req.body.subjectCode;
    const assignmentName = req.body.assignmentName;
    const dataType = req.body.dataType;
    const user = await User.findOne({ email: req.email });
    const username = user.username;
    if (Array.isArray(files)) {
      for (const file of files) {
        // files.forEach(async (file) => {
        const saveFile = new fileBuffer({
          userName: username,
          subjectCode: subjectCode,
          assignmentName: assignmentName,
          dataType: dataType,
          fileName: file.name,
          binary: file.data,
        });
        console.log(saveFile.fileName);

        await saveFile.save();
      }
    } else {
      const saveFile = new fileBuffer({
        userName: username,
        subjectCode: subjectCode,
        assignmentName: assignmentName,
        dataType: dataType,
        fileName: files.name,
        binary: files.data,
      });
      await saveFile.save();
    }

    return res.status(200).json({ msg: "Files uploaded" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const getFiles = async (req, res) => {
  try {
    const user = req.user.email;
    const subjectCode = req.body.subjectCode;
    const assignment = req.body.assignment;
    const dataType = req.body.dataType;
    const files = await fileBuffer.find({
      subjectCode: subjectCode,
      assignment: assignment,
      dataType: dataType,
    });
    files.forEach(async (file) => {
      fsp.writeFile(`./result/${user}/${file.fileName}`, file.binary);
    });

    return res.status(200).json({ msg: "Get files successfully" });
  } catch (error) {
    res.status(500).json({ msg: error, message });
  }
};

module.exports = {
  postSinglePDF,
  getSingleTXT,
  getMockResult,
  uploadFiles,
  getFiles,
};
