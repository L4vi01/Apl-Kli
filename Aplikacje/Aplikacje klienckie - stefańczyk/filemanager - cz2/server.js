const express = require("express");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const hbs = require("express-handlebars");

const app = express();
const PORT = 3000;
const BASE_DIR = path.join(__dirname, "upload");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"));

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", hbs({
    defaultLayout: "main.hbs",
    helpers: {
        isDirectory: function (name, options) {
            const fullPath = path.join(BASE_DIR, name);
            return fs.statSync(fullPath).isDirectory();
        }
    }
}));
app.set("view engine", "hbs");

// Utwórz folder upload, jeśli nie istnieje
if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR);
}

// Obsługa głównego trasy `/`
app.get("/", (req, res) => {
    res.redirect("/filemanager2");
});

// Wyświetlanie plików i katalogów
app.get("/filemanager2", (req, res) => {
    fs.readdir(BASE_DIR, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send("Błąd serwera");
        } else {
            const context = { files };
            res.render("filemanager2.hbs", context);
        }
    });
});

// Utworzenie nowego katalogu
app.post("/create-directory", (req, res) => {
    const dirName = req.body.dirName;
    const dirPath = path.join(BASE_DIR, dirName);
    fs.mkdir(dirPath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Błąd tworzenia katalogu");
        } else {
            res.redirect("/filemanager2");
        }
    });
});

// Utworzenie nowego pliku tekstowego
app.post("/create-file", (req, res) => {
    const fileName = req.body.fileName;
    const filePath = path.join(BASE_DIR, `${fileName}.txt`);
    fs.writeFile(filePath, "", (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Błąd tworzenia pliku");
        } else {
            res.redirect("/filemanager2");
        }
    });
});

// Usunięcie katalogu
app.get("/delete-directory", (req, res) => {
    const dirName = req.query.dirName;
    const dirPath = path.join(BASE_DIR, dirName);
    fs.rmdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Błąd usuwania katalogu");
        } else {
            res.redirect("/filemanager2");
        }
    });
});

// Usunięcie pliku
app.get("/delete-file", (req, res) => {
    const fileName = req.query.fileName;
    const filePath = path.join(BASE_DIR, fileName);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Błąd usuwania pliku");
        } else {
            res.redirect("/filemanager2");
        }
    });
});

// Upload plików
app.post("/upload-file", (req, res) => {
    const form = new formidable.IncomingForm({
        uploadDir: BASE_DIR,
        keepExtensions: true,
        multiples: true,
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            res.status(500).send("Błąd przesyłania pliku");
        } else {
            res.redirect("/filemanager2");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
