const mongoose = require("mongoose");
const { MONGO_URL } = require("./index");

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.log(err.message));

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB...");
});

mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose connection is disconnected...");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
