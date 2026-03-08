const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const connectionRequest = require("../models/connectionRequest");

//get all the pending connection request for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await connectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName skills age photoUrl"); // if we wont write anything after fromUserId then it will return all the details of the user but we only want to return firstName, lastName and emailId so we will write it like this. this is called projection in mongoose.

    res.json({
      message: "Request fetched successfully",
      data: pendingRequests,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending requests" });
  }
});

module.exports = userRouter;
