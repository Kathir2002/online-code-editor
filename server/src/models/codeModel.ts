import mongoose from "mongoose";

interface CodeSchema {
  fullCode: {
    html: string;
    css: string;
    javascript: string;
  };
  title: string;
  ownerInfo: mongoose.Types.ObjectId | string;
  ownerName: string;
}

const codeSchema = new mongoose.Schema<CodeSchema>({
  fullCode: {
    html: String,
    css: String,
    javascript: String,
  },
  title: {
    type: String,
    required: true,
  },
  ownerInfo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ownerName: String,
});

export const Code = mongoose.model("Code", codeSchema);
