import mongoose from "mongoose";

interface CodeSchema {
  fullCode: {
    html: string;
    css: string;
    javascript: string;
  };
}

const codeSchema = new mongoose.Schema<CodeSchema>({
  fullCode: {
    html: String,
    css: String,
    javascript: String,
  },
});

export const Code = mongoose.model("Code", codeSchema);
