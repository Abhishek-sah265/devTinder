const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcypt = require("bcrypt");

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password: " + value);
        }
      },
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
      default:
        "https://as1.ftcdn.net/v2/jpg/07/24/59/76/1000_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
    about: {
      type: String,
      maxLength: 500,
      default:
        "This is a default about section. Please update it to something more interesting!",
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

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$790", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isValidPassword = await bcypt.compare(
    passwordInputByUser,
    passwordHash,
  );
  return isValidPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
