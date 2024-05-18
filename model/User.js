const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      minLength: [3, "Name must be at least 3 characters."],
      maxLength: [100, "Name is too large"],
    },
    lastname: {
      type: String,
      required: false,
      trim: true,
      maxLength: [100, "Name is too large"],
    },
    empId: {
      type: String,
      unique: true,
      required: [true, "empId is required"],
      trim: true,
      minLength: [4, "Give valid Id"],
    },
    createdAt: Date,
    editedAt: Date,
    editedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    isActiveUser: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Provide a valid Email"],
      trim: true,
      lowercase: true,
      unique: true,
      required: false,
    },
    role: {
      type: String,
      default: 'DEVELOPER',
      enum: ['SUPER_ADMIN', 'ADMIN', 'DEVELOPER', 'TESTER']
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    // isEnabledAdminPrivileges: {
    //   type: Boolean,
    //   default: true,
    // },
    password: {
      type: String,
      required: [false, "Password is required"],
      minLength: [6, "Must be at least 6 character"],
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'editedAt' },
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    //  only run if password is modified, otherwise it will change every time we save the user!
    return next();
  }
  const password = this.password;
  const hashedPassword = bcrypt.hashSync(password);
  this.password = hashedPassword;

  next();
});

// comparePassword
userSchema.methods.comparePassword = function (password, hash) {
  const isPasswordValid = bcrypt.compareSync(password, hash);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
