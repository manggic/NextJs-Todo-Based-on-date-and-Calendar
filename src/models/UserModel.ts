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
    trim:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true 
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  calendar: [yearSchema],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

