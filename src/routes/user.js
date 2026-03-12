const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_FIELDS = "firstName lastName skills age gender photoUrl";

//get all the pending connection request for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_FIELDS); // if we wont write anything after fromUserId then it will return all the details of the user but we only want to return firstName, lastName and emailId so we will write it like this. this is called projection in mongoose.

    res.json({
      message: "Request fetched successfully",
      data: pendingRequests,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending requests" });
  }
});

userRouter.get("/user/connections", userAuth, async(req,res) => {
    try{

        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" },
            ],
        }).populate("fromUserId toUserId", USER_SAFE_FIELDS); // we can populate multiple fields by passing space separated field names in the populate method. here we are populating both fromUserId and toUserId fields with the specified USER_SAFE_FIELDS.");
       
        const data = connections.map((connection) => {
            // connection.fromUserId._id === loggedInUser._id is not working because connection.fromUserId._id is an ObjectId and loggedInUser._id is also an ObjectId and we cannot compare two ObjectIds using === operator. we have to use equals method of ObjectId to compare them.
            // or we have to use toString method of ObjectId to convert them to string and then compare them.
            if(connection.fromUserId._id.equals(loggedInUser._id)){
                return connection.toUserId;
            } else {
                return connection.fromUserId;
            }
        });
        res.json({
            message: "Connections fetched successfully",
            data: data,
        });
    } catch(err){
        res.status(400).send({message: "Error fetching connections: " + err.message});
    }
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        // user should see all the users except
        // 0. his own profile
        // 1. his existing connections
        // 2. users to whom he has sent request
        // 3. ignored users

        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1; // default page is 1
        let limit = parseInt(req.query.limit) || 10;
        limit = Math.min(limit, 50); // maximum limit is 50
        const skip = (page - 1) * limit;

        // find all connections of the logged in user(sent/received)
        const connectionsReq = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id},
                { toUserId: loggedInUser._id },
            ]
        }).select("fromUserId toUserId status");

        const excludedUserIds = new Set();
        connectionsReq.forEach((connection) => {
            excludedUserIds.add(connection.fromUserId.toString());
            excludedUserIds.add(connection.toUserId.toString());
        })

        // also add the logged in user id to the excludedUserIds set
        excludedUserIds.add(loggedInUser._id.toString());
        // find all the users except the excludedUserIds
        const users = await User.find({
            _id: { $nin: Array.from(excludedUserIds) },
        }).select(USER_SAFE_FIELDS).skip(skip).limit(limit);

        res.status(200).json({
            message: "Feed fetched successfully",
            data: users,
        });

    }
    catch(err) {
        res.status(400).send({message: "Error fetching feed: " + err.message});
    }
});

module.exports = userRouter;
