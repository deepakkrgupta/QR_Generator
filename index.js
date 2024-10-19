import express from "express";
import qr from "qr-image";
import fs from "fs";
import { dirname, join } from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

app.post("/submit", (req, res) => {
    const url = req.body.url;
    console.log("Received URL:", url);

    // Generate QR code and save it to file
    const qr_png = qr.image(url);
    const qrImagePath = join(__dirname, "public", "new_qr.png");
    qr_png.pipe(fs.createWriteStream(qrImagePath));
    fs.writeFile(join(__dirname, "public", "link.txt"), url, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    res.locals.new_qr_exists = true;
    res.render("home.ejs");
});

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
