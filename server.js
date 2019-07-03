require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();

const path = require("path");

const db = require("./config/keys").mongoURI;

//routes
const students = require("./routes/api/students");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/students", students);

const port = process.env.SERVER_PORT || 5000;
app.listen(port, () => console.log(`Server running on PORT ${port}`));

app.use("/static", express.static(path.join(__dirname, "public")));
