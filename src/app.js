const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Sandeep",
    lastName: "Sah",
    emailId: "sandeep.sah@example.com",
    password: "securepassword",
    age: 29,
    gender: "Male",
  });

  // const user = new User(userObj);
  try {
    await user.save();
    res.status(201).send("User signed up successfully");
  } catch (err) {
    res.status(500).send("Error signing up user: " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
