import mongoose from "mongoose";

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  userId: { type: String, required: true },
  createdOn: { type: Date, default: new Date().getTime() },
  modifiedAt: { type: Date, default: new Date().getTime() },
  type: {
    type: String,
    enum: ["Directory", "File"],
    default: "File",
  },
  parentPath: { type: String, default: "/" },
  sharedUsers: { type: [String], default: [] },
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
