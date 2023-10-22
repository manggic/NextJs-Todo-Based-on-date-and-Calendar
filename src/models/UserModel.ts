import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
});

const dateSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  tasks: [taskSchema],
  expenses: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

const monthSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dates: [dateSchema],
});

const yearSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  months: [monthSchema],
});
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  calendar: [yearSchema],
  userToken: String,
  userTokenExpiry: Date,
});

const User = mongoose?.models?.User || mongoose.model("User", userSchema);

export default User;
