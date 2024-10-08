import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV === "development" });

import * as connectionString from "./config.json" assert { type: "json" };
import { connect } from "mongoose";
connect(connectionString["default"]["connectionString"]);
import bcrypt from "bcrypt";
import User from "./models/user.model.js";
import Note from "./models/note.model.js";

import express, { json } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import authenticateToken from "./utilities.js";
const { sign } = jwt;
const app = express();

app.use(json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exist",
    });
  }

  const encryptedPassword = bcrypt.hashSync(password, 10);

  const user = new User({
    fullName,
    email,
    password: encryptedPassword,
  });

  await user.save();

  const accessToken = sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required " });
  }

  const userInfo = await User.findOne({ email: email });
  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  if (
    userInfo.email === email &&
    bcrypt.compareSync(password, userInfo.password)
  ) {
    const user = { user: userInfo };
    const accessToken = sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "3600m",
    });

    return res.json({
      error: false,
      message: "Login successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid credentials",
    });
  }
});

app.put("/forgot-password", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required " });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const encryptedPassword = bcrypt.hashSync(password, 10);

  user.password = encryptedPassword;

  await user.save();

  const accessToken = sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    email,
    accessToken,
    message: "Password Saved Successful",
  });
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags, fileType, parentPath } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }

  if (!content && fileType === "File") {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }

  try {
    const note = new Note({
      title,
      content: fileType === "Directory" ? "Directory" : content,
      tags: tags || [],
      userId: user._id,
      type: fileType,
      parentPath,
    });

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;

  const { title, content, tags } = req.body;

  const { user } = req.user;

  if (!title && !content && !tags) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    note.modifiedAt = new Date().getTime();

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.get("/get-all-users", authenticateToken, async (req, res) => {
  try {
    const users = await User.find({});
    return res.json({
      error: false,
      users: users,
      message: "All users retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const parentPath = req.query.parentPath;
  try {
    let notes = null;
    if (parentPath !== "")
      notes = await Note.find({
        $or: [
          { userId: user._id, parentPath: parentPath },
          { sharedUsers: user._id, parentPath: parentPath },
        ],
      });
    else
      notes = await Note.find({
        $or: [{ userId: user._id }, { sharedUsers: user._id }],
      });

    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });

    return res.json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.put("/move-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  const { newFolderPath } = req.body;

  if (!newFolderPath) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    if (newFolderPath) note.parentPath = newFolderPath;
    note.modifiedAt = new Date().getTime();

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.put("/share-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { user } = req.user;
  const { users } = req.body;

  if (!users || users.length === 0) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });

    if (!note) {
      return res.status(400).json({ error: true, message: "Note not found" });
    }

    const existingSharedUsers = note.sharedUsers;
    const finalSharedUsers = [...new Set(...existingSharedUsers, users)];
    note.sharedUsers = finalSharedUsers;
    note.modifiedAt = new Date().getTime();

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note Shared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.listen(8000, () => {
  console.log("Server started at port 8000");
});

export default app;
