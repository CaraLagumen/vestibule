const express = require("express");
const cors = require("cors");
const helmet = require(`helmet`);
const path = require("path");
const mongoSanitize = require(`express-mongo-sanitize`);
const xss = require(`xss-clean`);
const csp = require(`express-csp-header`);
const path = require(`path`);

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

const app = express();

//TRUST HEROKU
app.enable(`trust proxy`);

//HEROKU MODIFICATION
app.use(express.static(path.join(__dirname, `dist`, `vestibule`)));

app.use(cors()); //ACCESS-CONTROL-ALLOW-ORIGIN
app.options(`*`, cors());
app.use(helmet()); //SETUP SECURITY HEADERS
app.use(express.json({ limit: `10kb` })); //BODY PARSER & LIMIT DATA
app.use(express.urlencoded({ extended: true, limit: `10kb` })); //PARSE DATA FROM URL ENCODED FORM
app.use(mongoSanitize()); //DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(xss()); //DATA SANITIZATION AGAINST XSS
app.use(
  csp({
    //HEROKU BUG FIX?
    policies: {
      "default-src": [csp.NONE],
      "img-src": [csp.SELF]
    }
  })
);

app.use("/images", express.static(path.join("images")));

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
