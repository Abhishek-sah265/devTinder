const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://abhishekSah:Abhishek12345@namastenode.aia2e9u.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
