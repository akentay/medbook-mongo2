require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@medbook.com";
  const plainPassword = "admin123";

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);
  await User.create({ email, passwordHash });

  console.log("✅ Admin created");
  console.log("Email:", email);
  console.log("Password:", plainPassword);

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
