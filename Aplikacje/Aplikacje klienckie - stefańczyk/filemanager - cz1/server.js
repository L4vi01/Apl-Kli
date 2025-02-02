const express = require("express");
const path = require("path");
const formidable = require("formidable");
const fs = require("fs");
const hbs = require("express-handlebars");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs({
    defaultLayout: "main.hbs",
    helpers: {
        increment: num => num + 1,
        isEqual: (a, b) => a === b,
    },
}));
app.set("view engine", "hbs");

let filesDatabase = [];
let nextFileId = 1;

app.get("/", (req, res) => {
    res.render("upload.hbs");
});

app.post("/", (req, res) => {
    const form = new formidable.IncomingForm({
        uploadDir: path.join(__dirname, "static", "upload"),
        keepExtensions: true,
        multiples: true,
    });

    form.parse(req, (err, fields, files) => {
        console.log("Form Fields:", fields);
        console.log("Uploaded Files:", files);

        const uploadedFiles = Array.isArray(files.imagetoupload) ? files.imagetoupload : [files.imagetoupload];

        uploadedFiles.forEach(file => {
            const fileType = path.extname(file.name).toLowerCase();
            const fileIcon = getFileIcon(fileType);

            filesDatabase.push({
                id: nextFileId++,
                icon: fileIcon,
                name: file.name,
                size: file.size,
                type: file.type,
                path: file.path,
                uploadDate: Date.now(),
            });
        });

        res.redirect("/filemanager");
    });
});

app.get("/filemanager", (req, res) => {
    const context = { allFiles: filesDatabase.map(({ id, icon, name, size, type }) => ({ id, icon, name, size, type })) };
    res.render("filemanager.hbs", context);
    console.log(filesDatabase);
});

app.get("/deleteAll", (req, res) => {
    filesDatabase = [];
    nextFileId = 1;
    res.redirect("/filemanager");
});

app.get("/delete", (req, res) => {
    const fileId = parseInt(req.query.id, 10);
    filesDatabase = filesDatabase.filter(file => file.id !== fileId);
    res.redirect("/filemanager");
});

app.get("/download", (req, res) => {
    const fileId = parseInt(req.query.id, 10);
    const file = filesDatabase.find(f => f.id === fileId);
    if (file) {
        res.download(file.path);
    } else {
        res.status(404).send("File not found");
    }
});

app.get("/show", (req, res) => {
    const fileId = parseInt(req.query.id, 10);
    const file = filesDatabase.find(f => f.id === fileId);
    if (file) {
        res.sendFile(file.path);
    } else {
        res.status(404).send("File not found");
    }
});

app.get("/info", (req, res) => {
    const fileId = parseInt(req.query.id, 10);
    const file = filesDatabase.find(f => f.id === fileId);

    const context = file ? { info: { ...file, uploadDate: new Date(file.uploadDate).toLocaleString() } } : {};
    res.render("info.hbs", context);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

function getFileIcon(extension) {
    switch (extension) {
        case ".png":
            return "iconpng.png";
        case ".txt":
            return "icontxt.png";
        case ".jpg":
            return "iconjpg.png";
        default:
            return "iconNOT.png";
    }
}