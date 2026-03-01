const express = require("express");
const { userAuth } = require("../middleware/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; // we can get the user data from the request object because we have attached the user data to the request object in the userAuth middleware
    res.send(user);
  } catch (err) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
});

module.exports = profileRouter;
