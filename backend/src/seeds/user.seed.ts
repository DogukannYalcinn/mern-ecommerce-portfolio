import User from "../models/user";
import bcrypt from "bcrypt";
const userSeed = async () => {
  const user = await User.findOne({});
  if (user) return console.log("user already exists");
  const hashedPw = await bcrypt.hash("123456", 10);
  await User.create([
    {
      firstName: "John",
      lastName: "Doe",
      email: "test@test.com",
      password: hashedPw,
      deliveryAddress: {
        address: "9th St. PATH Station, New York",
        city: " New York",
        postalCode: "M8A 39B",
      },
      homeAddress: {
        address: "9th St. PATH Station, New York",
        city: " New York",
        postalCode: "M8A 39B",
      },
      phoneNumber: "+1234 567 890 / +12 345 678",
      cart: [],
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      password: hashedPw,
      deliveryAddress: {
        address: "9th St. PATH Station, New York",
        city: " New York",
        postalCode: "M8A 39B",
      },
      homeAddress: {
        address: "9th St. PATH Station, New York",
        city: " New York",
        postalCode: "M8A 39B",
      },
      phoneNumber: "+1234 567 890 / +12 345 678",
      cart: [],
    },
    {
      firstName: "Michael",
      lastName: "Brown",
      email: "michael.brown@example.com",
      password: hashedPw,
      deliveryAddress: {
        address: "9th St. PATH Station, New York",
        city: " New York",
        postalCode: "M8A 39B",
      },
      homeAddress: {
        address: "9th St. PATH Station, New York",
        city: " New York",
        postalCode: "M8A 39B",
      },
      phoneNumber: "+1234 567 890 / +12 345 678",
      cart: [],
    },
    {
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@example.com",
      password: hashedPw,
      deliveryAddress: {
        address: "9th St. PATH Station, New York",
        city: " New York",
        postalCode: "M8A 39B",
      },
      homeAddress: {
        address: "9th St. PATH Station, New York",
        city: " New York",
        postalCode: "M8A 39B",
      },
      phoneNumber: "+1234 567 890 / +12 345 678",
      cart: [],
    },
    {
      firstName: "William",
      lastName: "Johnson",
      email: "william.johnson@example.com",
      password: hashedPw,
      deliveryAddress: {
        address: "9th St. PATH Station, New York",
        city: " New York",
        postalCode: "M8A 39B",
      },
      homeAddress: {
        address: "9th St. PATH Station, New York",
        city: " New York",
        postalCode: "M8A 39B",
      },
      phoneNumber: "+1234 567 890 / +12 345 678",
      cart: [],
    },
  ]);
  console.log("user seeded successfully.");
};
export default userSeed;
