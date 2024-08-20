const User = require("../models/user");
const cloudinary = require("../configs/cloudinaryConfig");

exports.getProfile = async (req, res) => {
  // get profile logic...
  app.get("/Profile", authenticateJWT, async (req, res) => {
    try {
      const { userId } = req.user;
      console.log("UserId from token:", userId);

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID format" });
      }

      const user = await User.findById(userId);
      if (user) {
        const userData = {
          id: user._id,
          email: user.email,
          role: user.role,
          profileImagePublicId: user.profileImagePublicId,
          profileImageUrl: user.profileImageUrl,
          balance: user.balance,
          acceptedProposals: user.acceptedProposals,
          views: user.views,
          level: user.level,
          jobProposals: user.jobProposals,
          activeProposals: user.activeProposals,
          firstName: user.firstName,
        };
        return res.status(200).json({ userData });
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

exports.uploadProfilePicture = async (req, res) => {
  // upload profile picture logic...
  // Endpoint for uploading profile picture
  app.post(
    "/upload-profile-picture",
    upload.single("profilePicture"),
    async (req, res) => {
      const { userId } = req.body; // Get userId from request body

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      try {
        // Upload image to Cloudinary
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "profile_pictures" }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            })
            .end(req.file.buffer);
        });

        // Update user document with the new image URL and public ID
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          {
            profileImageUrl: result.secure_url,
            profileImagePublicId: result.public_id,
          },
          { new: true }
        );

        if (!updatedUser) {
          return res.status(404).json({ error: "User not found" });
        }

        // Send the updated user data back to the frontend
        res.status(200).json({
          message: "Profile picture updated successfully",
          user: updatedUser,
        });
      } catch (error) {
        console.error("Error uploading to Cloudinary or updating user:", error);
        return res
          .status(500)
          .json({ error: "Error updating profile picture" });
      }
    }
  );

  // Endpoint to fetch a user's profile (including profile picture URL)
  app.get("/user/:id", (req, res) => {
    const userId = req.params.id;

    // Validate the format of the ID before querying the database
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Return the user data, excluding sensitive fields if necessary
        res.status(200).json({
          status: "success",
          data: user,
        });
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
      });
  });
};
