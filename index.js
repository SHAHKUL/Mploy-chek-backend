require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userController = require("./controller/userController");
const app = express();
app.use(cors());
app.use(express.json());


app.use("/user", userController);
// Connect to MongoDB and start the server
mongoose
  .connect(process.env.URL)
  .then(() => {
    app.listen(process.env.Port, () => {
      console.log("Server connected on port", process.env.Port);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// Root route to check server status
app.get("/", (req, res) => {
  res.json({ message: "Server running successfully!" });
});
