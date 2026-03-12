const express = require("express");
const bcypt = require("bcrypt");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; // we can get the user data from the request object because we have attached the user data to the request object in the userAuth middleware
    res.send(user);
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      return res.status(400).send("Invalid data for updating profile!");
    }

    const loggedInUser = req.user; // we can get the user data from the request object because we have attached the user data to the request object in the userAuth middleware
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key]; // we are updating the user data with the new data sent by the client
    });
    await loggedInUser.save(); // we are saving the updated user data to the database

    res.json({
      message: `${loggedInUser.firstName}, your profile has been updated successfully!`,
      user: loggedInUser,
    });
  } catch (err) {
    return res.status(400).send("Error updating profile!" + err.message);
  }
});

profileRouter.patch("/profile/passwordChange", userAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const loggedInUser = req.user; // we can get the user data from the request object because we have attached the user data to the request object in the userAuth middleware
    const isOldPasswordValid = await loggedInUser.validatePassword(oldPassword);
    if (!isOldPasswordValid) {
      return res.status(401).send("Invalid old password!");
    }
    const hashedNewPassword = await bcypt.hash(newPassword, 10);
    loggedInUser.password = hashedNewPassword; // we are updating the user password with the new password sent by the client
    await loggedInUser.save(); // we are saving the updated user data to the database
    res.json({
      message: `${loggedInUser.firstName}, your password has been changed successfully!`,
    });
  } catch (err) {
    return res.status(400).send("Error changing password!" + err.message);
  }
});

module.exports = profileRouter;
