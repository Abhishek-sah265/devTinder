const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");

const app = express();
app.use(express.json()); // express.json() = converts raw JSON into JavaScript object
app.use(cookieParser()); // cookieParser() = reads cookies from browser and converts them into JS object

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile"); 
const requestRouter = require("./routes/request"); 

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777");
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
