const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

mongoose.connect(
  "mongodb+srv://chaitanyadhayarkar005_db_user:JoVECsF75xrSMgTy@cluster0.877qnji.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

async function resetAdminPassword() {
  const newPassword = "123456";  // your new admin password
  const hash = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate("62e3b6c1b417ec7933475d6c", { password: hash });

  console.log("Password updated successfully!");
  mongoose.disconnect();
}

resetAdminPassword();
