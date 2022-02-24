const mongoose = require("mongoose");

const TUTOR_MODEL = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  availability: { type: String, required: true },
  coursesToTeach: [ { type: String } ],
}, {timestamps: true, versionKey: false});

module.exports = mongoose.model("Tutor", TUTOR_MODEL);