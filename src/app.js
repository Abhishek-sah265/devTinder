const express = require("express");

const app = express();

//route handler for all API calls to /user
// we can use inside app.get, app.post, app.put etc.

// app.use("/route", RequestHandler1, [RequestHandler2, RequestHandler3], ...)

app.use(
  "/user",
  (req, res, next) => {
    console.log("Handling the request for /user 1");
    // next();
    res.send("Response 1");
    next();
  },
  [
    (req, res, next) => {
      console.log("Handling the request for /user 2");
      res.send("Response 2");
    },
    (req, res, next) => {
      console.log("Handling the request for /user 3");
      res.send("Response 3");
    },
  ],
  (req, res, next) => {
    console.log("Handling the request for /user 4");
    res.send("Response 4");
  },
);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
