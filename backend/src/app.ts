import { configDotenv } from "dotenv";
import checkEnvVariables from "./utils/check.env.variables";
import express from "express";
import mongoose from "mongoose";

import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import multer, { FileFilterCallback } from "multer";

import corsOptions from "./config/cors.options";
import generalRouter from "./routes/general.routes";
import productRouter from "./routes/product.routes";
import categoryRouter from "./routes/category.routes";
import orderRouter from "./routes/order.routes";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";
import setCorsCredential from "./middleware/cors.credentials";
import connectDB from "./config/connect.mongodb";
import handleError from "./middleware/handle.error";
import crypto from "crypto";
import OrderRules from "./models/order.rules";

configDotenv();

checkEnvVariables();

const app = express();
connectDB().then(() => {});

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomBytes(20).toString("hex") + "-" + file.originalname);
  },
});

const fileFilterCallback = (
  req: any,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(setCorsCredential);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(cookieParser());

app.use("/images", express.static(path.join(__dirname, "../images")));
app.use(
  multer({ storage: diskStorage, fileFilter: fileFilterCallback }).array(
    "images",
  ),
);

app.use("/api/generals", generalRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

app.use(handleError);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", async () => {
  app.listen(process.env.PORT);
});
