import Admin from "../models/admin";
import bcrypt from "bcrypt";

const adminSeed = async () => {
  const admin = await Admin.findOne({});

  if (admin) return console.log("Admin already exists");

  const hashedPw = await bcrypt.hash("1", 10);

  await Admin.create({
    username: "Admin",
    password: hashedPw,
    role: "host_admin",
  });
  console.log("admin seeded successfully.");
};
export default adminSeed;
