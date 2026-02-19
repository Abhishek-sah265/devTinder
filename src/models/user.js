const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 16,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      // by default the validate function and enum will only be called when we would create a new user but not in case of updating a old user.
      // validate(value) {          
      //   if(!["male", "female", "other"].includes(value)) {
      //     throw new Error("Invalid data");
      //   }
      // }
    },
    photoUrl: {
      type: String,
      default: "https://as1.ftcdn.net/v2/jpg/07/24/59/76/1000_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg",
    },
    about: {
      type: String,
      maxLength: 500,
      default: "This is a default about section. Please update it to something more interesting!",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 5) {
          throw new Error("Maximum 5 skills allowed!");
        }   
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
