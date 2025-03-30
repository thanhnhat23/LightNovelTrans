import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    profileBackground: {
      type: String,
      default: "",
    },
    profilePicId: { type: String },
    profileBackgroundId: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
    nameTag: { type: String },
    bio: { type: String },
    linkSocial_1: { type: String },
    linkSocial_2: { type: String },
    linkSocial_3: { type: String },
    nameSocial_1: { type: String },
    nameSocial_2: { type: String },
    nameSocial_3: { type: String },
    creatingPost: { type: Boolean, default: false },
    // Add 2 field: createdAt va updatedAt
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.nameTag) {
    this.nameTag = `#${this.userName}-neko`;
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
