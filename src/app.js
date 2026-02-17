const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  // const user = new User(userObj);
  try {
    await user.save();
    res.status(201).send("User signed up successfully");
  } catch (err) {
    res.status(500).send("Error signing up user: " + err.message);
  }
});

//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.find({ emailId: userEmail });
    // const user = await User.findOne({ emailId: userEmail }); // this will return a the first user it finds with the given emailId, if there are multiple users with the same emailId then it will return the first one it finds.
    // if we dont pass anything in findOne and there are multiple users then, it will return the first one it finds.

    if (user.length === 0) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
});

//find all the users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
});

app.get("/userById", async (req, res) => {
  // const userId = req.params.id; // this is for getting the userId from the url params, for example: /userById/12345
  const userId = req.body.id;
  try {
    const user = await User.findById(userId);
    if (!user) {  
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
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
