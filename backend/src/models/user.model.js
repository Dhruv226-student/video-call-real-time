const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },

    nativeLanguage: {
      type: String,
      default: "",
      // required: true
    },

    learningLanguage: {
      type: String,
      default: "",
      // required: true
    },
    location: {
      type: String,
      default: "",
      // required: true
    },
    isOnBoarded: {
      type: Boolean,
      default: false,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);


//pre hook to hash password
userSchema.pre("save", async function (next) {
  if (this.isNew && !this.isModified("password")) {
    return next();
  }
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userSchema);


module.exports = User;
