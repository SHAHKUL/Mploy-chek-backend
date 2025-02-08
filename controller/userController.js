require("dotenv").config();
const userController = require("express").Router();
const User = require("../model/userModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

userController.get("/allData", async (req, res) => {
  try {
    const user = await User.find();
    res.json({ user, message: "All User Data Fetched Successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});
userController.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({ message: "Already user exist enter another email id" });
    } else {
      const salt = bcryptjs.genSaltSync(10);
      const hashsync = bcryptjs.hashSync(password, salt);
      await User.create({ ...req.body, password: hashsync });
      res
        .status(201)
        .json({ message: "User Registered Successfully", register: true });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

userController.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const compare = bcryptjs.compareSync(password, user.password);

      if (compare) {
        const { name, email, _id } = user._doc;
        var token = jwt.sign(
          { id: user._id, name: user.name },
          process.env.KEY,
          {
            expiresIn: "24hr",
          }
        );

        res.json({ token, login: true, name, email, _id });
      } else {
        res.json({ message: "* Password is not matched" });
      }
    } else {
      res.json({ message: "* There is no registered data" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

userController.get("/allData/:id", async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.json({ user,message:"User Data Fetched Successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});
userController.get("/rolechek/", async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.find({ role });
    res.json({ user,message:"All User Fetched Succssfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});
userController.put("/updateRole/:id", async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ user,message:"User Role Changed Successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
});
module.exports = userController;
