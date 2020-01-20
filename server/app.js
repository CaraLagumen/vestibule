const express = require("express");
const cors = require("cors");
const helmet = require(`helmet`);
const path = require("path");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

//TRUST HEROKU
app.enable(`trust proxy`);

app.use(cors()); //ACCESS-CONTROL-ALLOW-ORIGIN
app.options(`*`, cors());
app.use(helmet()); //SETUP SECURITY HEADERS
app.use(express.json({ limit: `10kb` })); //BODY PARSER & LIMIT DATA
app.use(express.urlencoded({ extended: true, limit: `10kb` })); //PARSE DATA FROM URL ENCODED FORM
app.use("/images", express.static(path.join("images")));

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

//HEROKU MODIFICATION
const distDir = __dirname + "/dist/";
app.use(express.static(distDir));

module.exports = app;
