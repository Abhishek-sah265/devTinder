const express = require("express");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    // Logic to send connection request from senderId to recipientId
    res.send("Connection request sent successfully by " + user.firstName + " " + user.lastName);
  } catch (err) {
    res.status(500).send("Error sending connection request: " + err.message);
  } 
});

module.exports = requestRouter;