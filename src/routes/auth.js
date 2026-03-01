
const express = require("express");
const bcypt = require("bcrypt");

const authRouter = express.Router();
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");


authRouter.post("/signup", async (req, res) => {
  try {
    // validation of data can be done in two ways, one is to define the validate function in the user schema and the other is to create a separate validation function in a utils folder and call that function in the route handler, both ways are correct but it is a good practice to keep the validation logic separate from the route handlers, so that the code is more organized and easier to maintain.
    validateSignupData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
    const hashedPassword = await bcypt.hash(password, 10);

    // creating a new instance of the User model and saving it to the database
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).send("User signed up successfully");
  } catch (err) {
    res.status(500).send("Error signing up user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      //create JWT token
      // const token = jwt.sign({ _id: user._id }, "DEV@TINDER$790", {
      //   expiresIn: "7d",
      // });

      // create JWT token using the getJWT method defined in the user schema
      const token = await user.getJWT();

      // set the token in the cookie and send the response back to the user
      res.cookie("token", token, {
        httpOnly: true, // this will prevent the cookie from being accessed by the client-side JavaScript, which is a good security practice to prevent XSS attacks
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // this will set the expiration time of the cookie to 7 days
      });
      res.send("User logged in successfully");
    } else {
      return res.status(401).send("Invalid password");
    }
  } catch (err) {
    res.status(500).send("Error logging in user: " + err.message);
  }
});

module.exports = authRouter;