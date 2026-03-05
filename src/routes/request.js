const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        res.status(400).json({
          message: "User does not exist",
        });
      }
      // we can add this check in schema also using pre middleware.
      // if(toUserId === fromUserId){
      //   res.status(400).json({
      //     message: "you can't send request to yourself"
      //   })
      // }

      // when we have millions of user connection then this query will becomes more slow, 
      // so here we can introduce compound index.
      const existingConectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConectionRequest) {
        res.status(400).json({
          message: "Connection request already exist",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message:
          "Connection request sent successfully by " +
          fromUserId.firstName +
          " " +
          fromUserId.lastName,
        data,
      });
    } catch (err) {
      res.status(500).send("Error sending connection request: " + err.message);
    }
  },
);

module.exports = requestRouter;
