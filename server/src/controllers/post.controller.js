import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import zlib from "zlib";
import mammoth from "mammoth";
import fs from "fs";
import cloudinary from "../lib/cloudinary.js";

export const getPosts = async (req, res) => {
  try {
    const post = await Post.find()
      .populate("author", "userName profilePic nameTag")
      .populate("chapters.user", "userName profilePic nameTag")
      .sort({ createdAt: -1 });
    res.status(201).json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const {
    title,
    content,
    creator,
    describe,
    background,
    image,
    source,
    source_2,
  } = req.body;
  console.log("Fontend send: ", req.body);
  try {
    let newPost;
    if (background && image) {
      const uploadResponse = await cloudinary.uploader.upload(background, {
        transformation: [
          { width: 1000, crop: "scale" },
          { quality: "auto" },
          { fetch_format: "webp" },
        ],
      });
      const uploadImageResponse = await cloudinary.uploader.upload(image, {
        transformation: [
          { width: 500, crop: "scale" },
          { quality: "auto" },
          { fetch_format: "webp" },
        ],
      });
      newPost = new Post({
        author: req.user._id,
        title,
        content,
        creator,
        describe,
        source,
        source_2,
        background: uploadResponse.secure_url,
        image: uploadImageResponse.secure_url,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        title,
        content,
        creator,
        describe,
        source,
        source_2,
        background: null,
        image: null,
      });
    }

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json("Server error");
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id)
      .populate("author", "userName profilePic nameTag")
      .populate("chapters.user", "userName profilePic nameTag");

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json("Server error");
  }
};

export const createChapter = async (req, res) => {
  const { id } = req.params;
  const { title, chapterNumber, content, describe } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      console.error("Post not found:", id);
      return res.status(404).json({ message: "Post not found" });
    }

    let chapterContent = content;

    if (req.file) {
      const filePath = req.file.path;
      const buffer = fs.readFileSync(filePath);
      const arrayBuffer = new Uint8Array(buffer).buffer;

      const result = await mammoth.convertToHtml({ arrayBuffer });
      chapterContent = result.value.trim();

      fs.unlinkSync(filePath);
    }

    const lastChapterNumber =
      post.chapters.length > 0
        ? Math.max(...post.chapters.map((ch) => ch.chapNumber))
        : 0;

    const chapterNum = chapterNumber
      ? parseInt(chapterNumber)
      : lastChapterNumber + 1;
    const compressedContent = zlib
      .deflateSync(chapterContent)
      .toString("base64");

    const newChapter = {
      chapNumber: chapterNum,
      title,
      describe,
      content: compressedContent, // Lưu vào DB đã nén
      user: req.user._id,
    };

    post.chapters.push(newChapter);
    await post.save();

    res.status(201).json(newChapter);
  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChapters = async (req, res) => {
  const { id, chapterId } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    let chapter = post.chapters.id(chapterId);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    if (chapter.content) {
      try {
        chapter.content = zlib
          .inflateSync(Buffer.from(chapter.content, "base64"))
          .toString();
      } catch (err) {
        return res
          .status(500)
          .json({ message: "Failed to decompress content" });
      }
    }

    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const deletePost = async (req, res) => {
//   const { id } = req.params;
//   const userId = req.user._id;
//   try {
//     const post = await Post.findByIdAndDelete(id);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     if (post.author.toString() !== userId.toString()) {
//       return res
//         .status(403)
//         .json({ message: "You are not authorized to delete this post" });
//     }

//     if (post.image) {
//       const imagePublicId = post.image.split("/").pop().split(".")[0];
//       await cloudinary.uploader.destroy(imagePublicId);
//     }

//     await Post.findByIdAndDelete(id);
//     res.status(200).json({ message: "Post deleted successfully" });
//   } catch (error) {
//     res.status(500).json("Server error");
//   }
// };

export const deleteChapter = async (req, res) => {
  const { id, chapterId } = req.params;
  const userId = req.user._id;

  console.log(userId);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const chapter = post.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    if (!chapter.user || chapter.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to delete this chapter" });
    }

    post.chapters.pull(chapterId);
    await post.save();

    res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createComments = async (req, res) => {
  try {
    const { content, image, postId, chapterId } = req.body;
    const userId = req.user._id;

    if (!content && !image) {
      return res
        .status(400)
        .json({ message: "Comment must have content or an image!" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const chapter = post.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found!" });
    }

    let imageUrl = null;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          transformation: [
            { width: 500, crop: "scale" },
            { quality: "auto" },
            { fetch_format: "webp" },
          ],
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return res.status(500).json({
          message: "Image upload failed!",
          error: uploadError.message,
        });
      }
    }

    const newComment = {
      user: userId,
      content,
      image: imageUrl,
      createdAt: Date.now(),
    };

    chapter.comments.push(newComment);
    await post.save();

    await post.populate({
      path: "chapters.comments.user",
      select: "userName profilePic nameTag",
      strictPopulate: false,
    });

    return res.status(201).json({
      message: "Comment created!",
      comment: chapter.comments[chapter.comments.length - 1],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getComments = async (req, res) => {
  try {
    const { id, chapterId } = req.params;

    const post = await Post.findById(id).populate(
      "chapters.comments.user",
      "userName profilePic nameTag"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const chapter = post.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found!" });
    }

    return res.status(200).json({ comments: chapter.comments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
