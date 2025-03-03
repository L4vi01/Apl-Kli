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
            const fullPath = path.join(BASE_DIR, options.data.root.root, name);
            if (fs.existsSync(fullPath)) {
                return fs.statSync(fullPath).isDirectory();
            } else {
                return false;
            }
        },
        getFileIcon: function (name) {
            const extension = path.extname(name).toLowerCase();
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
    }
}));
app.set("view engine", "hbs");

// Utwórz folder upload, jeśli nie istnieje
if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR);
}

// Obsługa głównego trasy `/`
app.get("/", (req, res) => {
    res.redirect("/filemanager3");
});

// Wyświetlanie plików i katalogów
app.get("/filemanager3", (req, res) => {
    const root = req.query.root || "";
    const dirPath = path.join(BASE_DIR, root);
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send("Błąd serwera");
        } else {
            const pathArray = root.split("/").filter(Boolean).map((dir, index, arr) => {
                return { name: dir, path: arr.slice(0, index + 1).join("/") };
            });
            const context = { files, root, pathArray };
            res.render("filemanager3.hbs", context);
        }
    });
});

// Utworzenie nowego katalogu
app.post("/create-directory", (req, res) => {
    const root = req.body.root || "";
    const dirName = req.body.dirName;
    const dirPath = path.join(BASE_DIR, root, dirName);
    fs.mkdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Błąd tworzenia katalogu");
        } else {
            res.redirect(`/filemanager3?root=${root}`);
        }
    });
});

// Utworzenie nowego pliku tekstowego
app.post("/create-file", (req, res) => {
    const root = req.body.root || "";
    const fileName = req.body.fileName;
    const filePath = path.join(BASE_DIR, root, `${fileName}.txt`);
    fs.writeFile(filePath, "", (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Błąd tworzenia pliku");
        } else {
            res.redirect(`/filemanager3?root=${root}`);
        }
    });
});

// Usunięcie katalogu
app.get("/delete-directory", (req, res) => {
    const root = req.query.root || "";
    const dirName = req.query.dirName;
    const dirPath = path.join(BASE_DIR, root, dirName);
    fs.rmdir(dirPath, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Błąd usuwania katalogu");
        } else {
            res.redirect(`/filemanager3?root=${root}`);
        }
    });
});

// Usunięcie pliku
app.get("/delete-file", (req, res) => {
    const root = req.query.root || "";
    const fileName = req.query.fileName;
    const filePath = path.join(BASE_DIR, root, fileName);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send("Błąd usuwania pliku");
        } else {
            res.redirect(`/filemanager3?root=${root}`);
        }
    });
});

// Upload plików
app.post("/upload-file", (req, res) => {
    const root = req.body.root || "";
    const form = new formidable.IncomingForm({
        keepExtensions: true,
        multiples: true,
    });

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Błąd przesyłania pliku");
        }

        const uploadedFiles = Array.isArray(files.filetoupload) ? files.filetoupload : [files.filetoupload];

        const tasks = uploadedFiles.map((file) => new Promise((resolve, reject) => {
            console.log('File:', file); // Debugging output
            const oldPath = file.path;
            const originalFilename = file.name;

            if (!originalFilename) {
                console.error('No original filename found.');
                return reject(new Error("Brak oryginalnej nazwy pliku"));
            }

            const newPath = path.join(BASE_DIR, root, originalFilename);

            // Ensure the new path directory exists
            const newDir = path.dirname(newPath);
            if (!fs.existsSync(newDir)) {
                fs.mkdirSync(newDir, { recursive: true });
            }

            fs.copyFile(oldPath, newPath, (err) => {
                if (err) {
                    console.error(err);
                    return reject(new Error("Błąd podczas kopiowania pliku"));
                }

                fs.unlink(oldPath, (err) => {
                    if (err) {
                        console.error(err);
                        return reject(new Error("Błąd podczas usuwania pliku tymczasowego"));
                    }
                    resolve();
                });
            });
        }));

        Promise.all(tasks)
            .then(() => res.redirect(`/filemanager3?root=${root}`))
            .catch((error) => {
                console.error(error);
                res.status(500).send(error.message);
            });
    });
});

// Zmiana nazwy katalogu
app.post("/rename-directory", (req, res) => {
    const root = req.body.root || "";
    const oldName = req.body.oldName;
    const newName = req.body.newName;
    const oldPath = path.join(BASE_DIR, root, oldName);
    const newPath = path.join(BASE_DIR, root, newName);

    if (!fs.existsSync(newPath)) {
        fs.rename(oldPath, newPath, (err) => {
            if (err) console.error(err);
            res.redirect(`/filemanager3?root=${root.replace(oldName, newName)}`);
        });
    } else {
        res.status(400).send("Nazwa już istnieje");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
