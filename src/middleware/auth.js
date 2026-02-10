
const adminAuth = (req, res, next) => {
    console.log("Admin authentication middleware"); 
    const token = "xyzadmin"; // Example token, in real scenarios this would come from request headers or cookies
    const isAdminAuthenticated = token === "xyzadmin"; // Simulated check
    if (!isAdminAuthenticated) {
        return res.status(401).send("Unauthorized: Admin access required");
    }
    next();
}

const userAuth = (req, res, next) => {
    console.log("User authentication middleware"); 
    const token = "xyzuer"; // Example token, in real scenarios this would come from request headers or cookies
    const isUserAuthenticated = token === "xyzuser"; // Simulated check
    if (!isUserAuthenticated) {
        return res.status(401).send("Unauthorized: User access required");
    }
    next();
}

module.exports = { adminAuth, userAuth };