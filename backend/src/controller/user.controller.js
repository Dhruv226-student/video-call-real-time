const { FriendRequest } = require("../models");
const User = require("../models/user.model");
const { userService } = require("../services");

module.exports = {
  getRecommendedUsers: async (req, res) => {
    try {
      const userId = req.user._id;
      const currentUser = req.user;

      const recommendedUsers = await userService.getAll({
        $and: [
          { _id: { $ne: userId } }, // Exclude the current user
          { _id: { $nin: currentUser.friends } }, // Exclude friends
          { isOnBoarded: true }, // Only include users who are onboarded
          // { _id: { $nin: currentUser.blockedUsers } }, // Exclude blocked users
        ],
      });
      res.status(200).json(recommendedUsers);
    } catch (error) {
      console.error("Error in getRecommendedUsers:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
  getMyFriends: async (req, res) => {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId)
        .populate("friends")
        .populate(
          "friends",
          "fullName profilePic nativeLanguage learningLanguage location"
        );

      res.status(200).json(user.friends);
    } catch (error) {
      console.error("Error in getMyFriends:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
  sendFriendRequest: async (req, res) => {
    try {
      const myId = req.user._id;
      const { id: recipentId } = req.params;

      if (myId === recipentId) {
        return res.status(400).json({
          status: "error",
          message: "You cannot send a friend request to yourself",
        });
      }
      const recipent = await userService.getOne({ _id: recipentId });
      if (!recipent) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      if (recipent.friends.includes(myId)) {
        return res.status(400).json({
          status: "error",
          message: "You are already friends with this user",
        });
      }

      const existingRequest = await FriendRequest.findOne({
        $or: [
          { sender: myId, recipent: recipentId },
          { sender: recipentId, recipent: myId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({
          status: "error",
          message: "Friend request already sent",
        });
      }
      const friendRequest = await FriendRequest.create({
        sender: myId,
        recipent: recipentId,
      });

      res.status(200).json({
        status: "success",
        message: "Friend request sent successfully",
        data: friendRequest,
      });
    } catch (error) {
      console.error("Error in sendFriendRequest:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
  acceptFriendRequest: async (req, res) => {
    try {
      const { id: requestId } = req.params;
      const myId = req.user._id;
      const friendRequest = await FriendRequest.findById(requestId);

      if (!friendRequest) {
        return res.status(404).json({
          status: "error",
          message: "Friend request not found",
        });
      }
      if (friendRequest.recipent.toString() !== myId.toString()) {
        return res.status(403).json({
          status: "error",
          message: "You are not authorized to accept this request",
        });
      }
      friendRequest.status = "accepted";
      await friendRequest.save();
      //  add each other to friends list
      await User.findByIdAndUpdate(friendRequest.sender, {
        $addToSet: { friends: friendRequest.recipent },
      });
      await User.findByIdAndUpdate(friendRequest.recipent, {
        $addToSet: { friends: friendRequest.sender },
      });

      res.status(200).json({
        status: "success",
        message: "Friend request accepted successfully",
      });
    } catch (error) {
      console.error("Error in acceptFriendRequest:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },
  getFriendRequests: async (req, res) => {
    try {
      const incomingRequests = await FriendRequest.find({
        recipent: req.user._id,
        status: "pending",
      }).populate(
        "sender",
        "fullName profilePic nativeLanguage learningLanguage location"
      );

      const acceptedRequests = await FriendRequest.find({
        recipent: req.user._id,
        status: "accepted",
      }).populate(
        "sender",
        "fullName profilePic nativeLanguage learningLanguage location"
      );

      // const outgoingRequests = await FriendRequest.find({
      //   sender: req.user._id,
      //   status: "pending",
      // }).populate("recipent", "fullName profilePic nativeLanguage learningLanguage location");

      const allRequests = {
        incomingRequests,
        acceptedRequests,
        // outgoingRequests,
      };

      res.status(200).json({
        status: "success",
        message: "Friend requests fetched successfully",
        data: allRequests,
      });
    } catch (error) {
      console.error("Error in getFriendRequests:", error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  },

  getOutgoingFriendRequests: async (req, res) => {
    try {
      const outgoingRequests = await FriendRequest.find({
        sender: req.user._id,
        status: "pending",
      }).populate(
        "recipent",
        "fullName profilePic nativeLanguage learningLanguage location"
      );
      res.status(200).json({
        status: "success",
        message: "Outgoing friend requests fetched successfully",
        data: outgoingRequests,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
      console.error("Error in getOutgoingFriendRequests:", error);
    }
  },
};
