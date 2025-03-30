import User from "../models/user.model.js";

export const checkUsers = async (req, res) => {
  try {
    const users = await User.find().select("-email -password -_id -resetPasswordToken");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error checking users controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    let { nameTag } = req.params;
    nameTag = decodeURIComponent(nameTag);
    
    const user = await User.findOne({ nameTag }).select(
      "-password -resetPasswordToken -resetPasswordExpiresAt"
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error get public profile controller: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

