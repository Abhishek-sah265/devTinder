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
      index: true, //make search by firstname more efficient
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
      unique: true, // mongo db automatically created index for unique equals to true.
      // Indexes support efficient execution of queries in MongoDB 
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
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not supported`, // this message will be shown when the user tries to save a gender that is not in the enum array, but this validation will only work when we are creating a new user and not when we are updating an old user because by default the enum validation will only be called when we would create a new user but not in case of updating a old user.
      },
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

//if we want to find a user by firstname and lastname and there are millions of user then the db will take a lot of time so, to make it faster we will create a compound index to make the query more efficient
// User.find({firstName: "Abhishek", lastName: "sah"})
// userSchema.index({firstName: 1}); // normal index
userSchema.index({firstName: 1, lastName: 1}); // compound index

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$790", {
    expiresIn: "7d",
  });

  return token;
};

// this can only be accessed on the instances of the user model and not on the user model itself because we are using function keyword and not arrow function because we want to use the this keyword to access the user data.
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
