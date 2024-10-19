import mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
  } catch (error) {
    console.log("something went wrong");
    console.log(error);
  }
}
