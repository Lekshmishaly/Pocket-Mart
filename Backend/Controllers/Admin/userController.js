const bcrypt = require("bcrypt");
const User = require("../../Models/userModel");

async function ConsumerList(req, res) {
  try {
    const userDetails = await User.find();

    if (!userDetails) {
      return res
        .status(404)
        .json({ success: false, message: "user fetch failed" });
    }
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      userDetails,
    });
  } catch (error) {
    console.log(error);
  }
}
/////////////////////////// consumer blocking //////////////////////
async function toggleConsumer(req, res) {
  try {
    const { _id, isActive } = req.body;

    const updateDetails = await User.findByIdAndUpdate(
      _id,
      {
        isActive: !isActive,
      },
      {
        new: true,
      }
    );
    console.log(updateDetails);
    if (!updateDetails) {
      return res
        .status(400)
        .json({ message: "Unable to update, please try again" });
    }

    if (updateDetails.isActive) {
      return res
        .status(200)
        .json({ message: `${updateDetails.firstname} is Unblocked` });
    } else {
      return res
        .status(200)
        .json({ message: `${updateDetails.firstname} is Blocked` });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = {
  ConsumerList,
  toggleConsumer,
};
