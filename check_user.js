require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const users = await User.find();
  console.log("USERS:", users);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
