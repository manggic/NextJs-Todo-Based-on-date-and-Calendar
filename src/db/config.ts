import mongoose, { ConnectOptions } from "mongoose";

const { MONGO_URL } = process.env;

export const connect = async () => {
  try {
    const mongoURL: any = MONGO_URL;

    if (!mongoURL) {
      throw new Error("MONGO_URL is not defined in the environment variables.");
    }

    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    const db = mongoose.connection;

    db.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    db.once("open", () => {
      console.log("Connected to MongoDB successfully!");
    });
  } catch (error) {
    console.log("DB connection failed!!!");
    console.log("DB ERROR >>", error);
  }
};
