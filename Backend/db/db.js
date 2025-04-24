import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

function connect() {
  const mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    console.error("MONGO_URL is not defined in the environment variables.");
    return;
  }

  mongoose.connect(mongoUrl)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
}

export default connect;
