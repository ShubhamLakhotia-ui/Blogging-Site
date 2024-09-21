const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const{ createTokenForUser}=require("../services/authentication");
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    profileImage: {
      type: String,
      default: "/images/Profile-PNG-Images.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashesPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashesPassword;
  next();
});

userSchema.static("matchPassword", async function (email, passowrd) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User Not Found");

  const salt = user.salt;
  const hashesPassword = user.password;
  const userProvidedPassword = createHmac("sha256", salt)
    .update(passowrd)
    .digest("hex");
  if (userProvidedPassword !== hashesPassword)
    throw new Error("Incorrect Password");
  const token=createTokenForUser(user);
  return token;
});
const User = model("User", userSchema);
module.exports = User;
