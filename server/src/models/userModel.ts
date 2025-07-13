import mongoose from "mongoose";

interface IUserSchema {
  username: string;
  email: string;
  password: string;
  picture: string;
  profileUrl: string;
  savedCodes: Array<mongoose.Types.ObjectId>;
  isFromGithub?: boolean;
  githubAccessToken?: string;
}

const UserSchema = new mongoose.Schema<IUserSchema>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
    },
    picture: {
      type: String,
      default:
        "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-profile-picture-grey-male-icon.png",
    },
    profileUrl: {
      type: String,
      default: "https://github.com/Kathir2002",
    },
    isFromGithub: {
      type: Boolean,
      default: false,
    },
    githubAccessToken: {
      type: String,
      default: "",
    },
    savedCodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Code" }],

  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
