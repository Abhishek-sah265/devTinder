const express = require("express");
const app = express();

// the order of this middleware matters, we should define it after all routes not in the start.
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.get("/user", (req, res) => {
  try {
    throw new Error("Simulated server error");
    res.send("User route accessed successfully");
  } catch (err) {
    res.status(500).send("Try catch Error");
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
