const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

//add router here
const userRouter = require("./controllers/users");

const PORT = 5000;
const URL = "mongodb://localhost:27017/";
const DATABASE = "tutorialScheduler";

app.use(
  bodyParser.json({
    limit: "5mb",
    verify: (req, res, buf, encoding) => {
      req.bodyPlainText = buf.toString();
      return true;
    }
  })
)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//use controllers here
app.use(userRouter);

mongoose.connect(`${URL}${DATABASE}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let server;

server = app.listen(PORT, err => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}.`);
});

module.exports = server;