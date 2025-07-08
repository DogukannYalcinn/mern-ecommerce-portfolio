import { configDotenv } from "dotenv";
configDotenv();
import connectDB from "../config/connect.mongodb";
import categorySeed from "./category.seed";
import productSeed from "./product.seed";
import userSeed from "./user.seed";
import adminSeed from "./admin.seed";
import orderRuleSeed from "./order.rule.seed";
import sliderSeed from "./slider.seed";
import reviewSeed from "./review.seed";

const runAllSeeds = async () => {
  try {
    await connectDB();
    await categorySeed();
    await productSeed();
    await userSeed();
    await adminSeed();
    await orderRuleSeed();
    await sliderSeed();
    await reviewSeed();

    console.log("🎉 All seeds completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

runAllSeeds();
