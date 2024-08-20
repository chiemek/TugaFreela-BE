const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  role: { type: String, required: true },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\+?(\d{1,3})?[-.\s]?(\d{3})[-.\s]?(\d{3})[-.\s]?(\d{4})$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  dateOfBirth: Date,
  address: String,
  postalCode: String,
  state: String,
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid password!`,
    },
  },
  firstName: String,
  lastName: String,
  id: String,
  nif: String,
  citizenCard: String,
  title: String,
  categories: [String],
  description: String,
  rate: Number,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profileImageUrl: String,
  profileImagePublicId: String,
  profilePicture: String,
  balance: Number,
  proposals: Number,
  acceptedProposals: Number,
  views: Number,
  level: Number,
  jobProposals: [
    {
      name: String,
      proposals: Number,
      clientsName: String,
      clientId: String,
      status: String,
      date: Date,
    },
  ],
  activeProposals: [
    {
      name: String,
      proposals: Number,
      clientsName: String,
      clientId: String,
      status: String,
      date: Date,
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
