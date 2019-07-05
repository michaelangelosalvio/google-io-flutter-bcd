const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  id_number: String,
  name: String,
  absences: [Date]
});

module.exports = mongoose.model("students", StudentSchema);
