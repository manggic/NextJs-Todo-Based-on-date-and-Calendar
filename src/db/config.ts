import mongoose from "mongoose";

// const { MONGO_URL } = process.env;

export const connect = async () => {
  try {


    mongoose.connection.on("connected", () => {
      console.log("MONGO_DB CONNECTED");
    });
    const mongoURL = "mongodb://127.0.0.1:27017/todo";
    
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
   
  } catch (error) {
    console.log("DB connection failed!!!");
    console.log("DB ERROR", error);
  }
};
