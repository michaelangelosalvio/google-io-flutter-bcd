const express = require("express");
const router = express.Router();
const Student = require("./../../models/Student");
const moment = require("moment-timezone");

router.get("/:id_number", (req, res) => {
  Student.findOne({
    id_number: req.params.id_number
  }).then(student => res.json(student));
});

router.get("/", (req, res) => {
  Student.find().then(students => {
    setTimeout(() => {
      return res.json(students);
    }, 3000);
  });
});

router.put("/:id_number/absent", (req, res) => {
  Student.findOne({
    id_number: req.params.id_number
  }).then(student => {
    if (student) {
      const absences = [
        moment.tz(moment(), process.env.TIMEZONE).toDate(),
        ...student.absences
      ];
      student.set({
        absences
      });

      student
        .save()
        .then(newStudent => {
          return res.json(newStudent);
        })
        .catch(err => console.log(err));
    } else {
      return res.json({ msg: "ID # not found" });
    }
  });
});

module.exports = router;
