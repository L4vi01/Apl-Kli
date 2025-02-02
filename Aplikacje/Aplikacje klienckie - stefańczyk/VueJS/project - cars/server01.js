const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const hbs = require("express-handlebars");
const Datastore = require("nedb");

app.use(express.urlencoded({ extended: true }));

const coll1 = new Datastore({ filename: "kolekcja.db", autoload: true });

app.set("views", path.join(__dirname, "views"));
app.engine(
    "hbs",
    hbs({
        defaultLayout: "main.hbs",
        helpers: {
            eq: (a, b) => a === b,
        },
    })
);
app.set("view engine", "hbs");
app.use(express.static("static"));

app.get("/add", (req, res) => {
    res.render("add.hbs");
});

app.get("/delete", (req, res) => {
    coll1.find({}, (err, Doc) => {
        res.render("delete.hbs", { Doc });
    });
});

app.post("/delAll", (req, res) => {
    coll1.remove({}, { multi: true }, (err, numRemoved) => {
        console.log("usunięto dokumentów:", numRemoved);
        res.render("delete.hbs");
    });
});

app.post("/delSel", (req, res) => {
    let selectedbox = req.body.selCars || [];
    selectedbox = Array.isArray(selectedbox) ? selectedbox : [selectedbox];

    coll1.remove({ _id: { $in: selectedbox } }, { multi: true }, (err, numRemoved) => {
        if (err) {
            console.error("Błąd podczas usuwania:", err);
        } else {
            console.log("Usunięto elementy:", numRemoved);
        }

        coll1.find({}, (err, Doc) => {
            res.render("delete.hbs", { Doc, num: selectedbox.length });
        });
    });
});

app.post("/delBtn", (req, res) => {
    const btnId = req.body.btn;

    coll1.remove({ _id: btnId }, {}, (err, numRemoved) => {
        if (!err) {
            console.log("Usunięto elementy:", numRemoved);
        }

        coll1.find({}, (err, Doc) => {
            res.render("delete.hbs", { Doc });
        });
    });
});

app.get("/edit/:id", (req, res) => {
    const id = req.params.id;

    if (req.query.type) {
        const updateData = {
            ubezpieczony: req.query.ubezpieczony,
            benzyna: req.query.benzyna,
            uszkodzony: req.query.uszkodzony,
            naped: req.query.naped
        };
        coll1.update({ _id: id }, updateData, {}, function (err, numUpdated) {
            res.redirect("/edit");
        });
    } else {
        coll1.find({}, function (err, Doc) {
            const updatedDocs = [];
            for (let i = 0; i < Doc.length; i++) {
                if (Doc[i]._id === id) {
                    Doc[i].isEdited = true;
                }
                updatedDocs.push(Doc[i]);
            }
            res.render("edit.hbs", { Doc: updatedDocs, _id: id });
        });
    }
});

app.get("/edit", (req, res) => {
    coll1.find({}, (err, Doc) => {
        res.render("edit.hbs", { Doc });
    });
});

app.get("/", (req, res) => {
    res.render("index.hbs");
});

app.get("/list", (req, res) => {
    coll1.find({}, (err, Doc) => {
        res.render("list.hbs", { Doc });
    });
});

app.post("/add", (req, res) => {
    const doc = {
        ubezpieczony: req.body.ubezpieczony ? "tak" : "nie",
        benzyna: req.body.benzyna ? "tak" : "nie",
        uszkodzony: req.body.uszkodzony ? "tak" : "nie",
        naped: req.body.naped ? "tak" : "nie",
    };

    coll1.insert(doc, (err, newDoc) => {
        console.log("dodano dokument (obiekt):", newDoc);
        res.render("add.hbs", { id: newDoc._id });
    });
});

app.listen(PORT, () => {
    console.log("start serwera na porcie " + PORT);
});
