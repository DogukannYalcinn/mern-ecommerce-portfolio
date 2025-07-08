import Review from "../models/review";
import User from "../models/user";
import Product from "../models/product";

const reviewSeed = async () => {
  const review = await Review.findOne({});
  if (review) return console.log("review already exists");

  const products = await Product.find();
  const users = await User.find();

  if (!users) {
    throw new Error("Users not found.");
  }
  if (!products) {
    throw new Error("Products not found.");
  }

  for (const product of products) {
    const randomUser = users[Math.floor(Math.random() * users.length)];

    const newReview = await Review.create({
      user: randomUser._id,
      product: product._id,
      rating: 5,
      comment:
        "My old IMAC was from 2013. This replacement was well needed. Very fast, and the colour matches my office set up perfectly. The display is out of this world and I’m very happy with this purchase.",
    });

    await newReview.save();
  }
  console.log("review seeded successfully.");
};
export default reviewSeed;
