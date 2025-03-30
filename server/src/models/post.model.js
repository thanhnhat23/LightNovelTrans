import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  chapNumber: {
    type: Number,
    required: true,
    default: function () {
      return this.parent().chapters.length + 1;
    },
  },
  title: { type: String, required: true },
  content: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  // Comments
  comments: [
    {
      content: { type: String, required: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      image: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    image: { type: String },
    background: { type: String },
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: String, required: true },
    source: { type: String },
    source_2: { type: String },
    describe: { type: String },

    chapters: [chapterSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
