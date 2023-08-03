const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      minLength: 6,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/djqxdscwh/image/upload/v1687412966/user_qqwk6f.png",
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    posts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
    followings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
    bookmarks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Post",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//   if (!this.isModified) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// userSchema.methods.isMatchPassword = async function (enteredPassword) {
//   const isMatch = await bcrypt.compare(enteredPassword, this.password);
//   return isMatch;
// };

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
