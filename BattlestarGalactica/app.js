var express = require("express");
var app = express();
const session = require("express-session");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);

app.use(express.static("views"));

// Load routing
require("./appFrame/index")(app);

var server = app.listen(3000, function() {
  console.log("Running on :3000");
});
