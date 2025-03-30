import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.aggregate([
      { $match: { _id: { $ne: loggedInUserId } } }, // Lọc bỏ user hiện tại
      {
        $lookup: {
          from: "messages",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$senderId", "$$userId"] },
                    { $eq: ["$receiverId", "$$userId"] },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } }, // Sắp xếp tin nhắn mới nhất
            { $limit: 1 }, // Lấy tin nhắn gần nhất
          ],
          as: "latestMessage",
        },
      },
      { $sort: { "latestMessage.createdAt": -1 } }, // Sắp xếp theo tin nhắn gần nhất
    ]);

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: senderId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: senderId },
      ],
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image, {
        transformation: [
          { width: 500, crop: "scale" },
          { quality: "auto" },
          { fetch_format: "webp" }
        ],
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // Realtime chat
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
