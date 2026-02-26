const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = (req, res, next) => {
    console.log("Admin authentication middleware"); 
    const token = "xyzadmin"; // Example token, in real scenarios this would come from request headers or cookies
    const isAdminAuthenticated = token === "xyzadmin"; // Simulated check
    if (!isAdminAuthenticated) {
        return res.status(401).send("Unauthorized: Admin access required");
    }
    next();
}

const userAuth = async (req, res, next) => {
   try{
    const {token} = req.cookies;

    if(!token){
        return res.status(401).send("Token not valid!!");
    }
    const decodedObj = await jwt.verify(token, "DEV@TINDER$790");
    const {_id} = decodedObj;
    const user = await User.findById(_id);

    if(!user){
        return res.status(404).send("User not found");
    }
    req.user = user; // Attach user data to the request object for use in subsequent middleware or route handlers
    next();
   } catch(err){
    return res.status(400).send("Error authenticating user: " + err.message);
   }
}

module.exports = { userAuth };