import mongoose, { ConnectOptions } from "mongoose";

const { MONGO_URL } = process.env;

export const connect = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MONGO_DB CONNECTED");
    });
    const mongoURL = MONGO_URL || "mongodb://127.0.0.1:27017/todo";

    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
  } catch (error) {
    console.log("DB connection failed!!!");
    console.log("DB ERROR", error);
  }
};
