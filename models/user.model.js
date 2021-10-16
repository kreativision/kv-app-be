const mongoose = require("mongoose");
const roles = require("../constants/roles");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: Number, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: roles.CUSTOMER,
      enum: Object.keys(roles),
    },
  },
  { timestamps: true }
);

/**
 * Hash the password before saving to the db.
 * Also saves the hassle of putting the hashing code inside of the controller route function.
 *
 * 'function' keyword is required since we are accessing 'this',
 * using arrow function will cause issues with lexical scoping.
 */
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

/**
 * Function to compare password while signing on.
 * Having this here also saves a lot of code from the controller file.
 */
userSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("user", userSchema);
