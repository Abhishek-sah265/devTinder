const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields =["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];
  const fieldsToUpdate = Object.keys(req.body);

  const isEditAllowed = fieldsToUpdate.every((field) => allowedEditFields.includes(field));

  return isEditAllowed;
};

module.exports = {
  validateSignupData,
  validateEditProfileData
};
