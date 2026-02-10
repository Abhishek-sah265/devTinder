const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");
const app = express();

// Request  →  middleware(s)  →  route handler  →  Response

app.use("/admin", adminAuth);
// app.use("/user", userAuth); // we can also apply middleware like this

app.post("/user/login"), (req,res) => {
    res.send("User logged in successfully");
}

// because we have only route for user then we can also apply middleware like this
app.get("/user", userAuth, (req, res, next) => {
  res.send("User route accessed successfully");
});


app.use("/admin/getAllData", (req,res,next) => {
    res.send("All data sent successfully");
})

app.use("/admin/deleteData", (req,res,next) => {
    res.send("Deleted data successfully");
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
