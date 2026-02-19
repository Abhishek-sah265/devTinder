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

app.delete("/user", async (req, res) => {
  const userId = req.body.id;
  try {
    const user = await User.findByIdAndDelete(userId);  
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send("User deleted successfully");
    }
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
});

app.patch("/user/:id", async (req,res) => {
  const userId = req.params?.id;
  // const userId = req.body.id; // this is for getting the userId from the request body, we can use either params or body to get the userId, but it is a good practice to use params for getting the id of the resource we want to update or delete and use body for getting the data we want to update.
  const updateData = req.body;

  try {

    const ALLOWED_UPDATES = ["firstName", "lastName", "password", "age", "gender", "photoUrl", "about", "skills"];
    const updates = Object.keys(updateData);
    const isValidOperation = updates.every((update) => ALLOWED_UPDATES.includes(update));

    if (!isValidOperation) {
      return res.status(400).send("Invalid updates!");
    }
    // console.log("updateData: ", updateData.skills);
    // if(updateData.skills && updateData.skills.length > 5){
    //   return res.status(400).send("Maximum 5 skills allowed!");
    // }
    const user = await User.findByIdAndUpdate(userId, updateData, {
      runValidators: true, // this will run the validators defined in the user schema while updating the user, for example if we try to update the age of the user to 10 then it will throw an error because the minimum age defined in the user schema is 16.
      returnDocument: "after", // this is an alternative to new: true, it will return the updated user instead of the old one, but it is only available in mongoose version 6.0 and above
    });
    if (!user) {
      return res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("something went wrong: " + err.message);
  }
});

app.patch("/userByEmail", async (req,res) => {
  const userEmail = req.body.emailId;
  const updateData = req.body;
  try {
    const user = await User.findOneAndUpdate({ emailId: userEmail }, updateData);
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
