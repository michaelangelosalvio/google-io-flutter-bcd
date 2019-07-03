const express = require("express");
const router = express.Router();
const Student = require("./../../models/Student");

router.get("/", (req, res) => {
  Student.find().then(students => {
    setTimeout(() => {
      return res.json(students);
    }, 3000);
  });
});

module.exports = router;
