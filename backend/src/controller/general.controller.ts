import { Request, Response, NextFunction } from "express";
import Announcement from "../models/announcement";
import Slider from "../models/slider";
import OrderRules from "../models/order.rules";
import Product from "../models/product";

export const getActiveAnnouncements = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const active = await Announcement.findOne({ isActive: true });
    res.status(200).json(active);
  } catch (err) {
    next(err);
  }
};

export const getSliders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const slides = await Slider.find().sort("-created").exec();
    res.status(200).json(slides);
  } catch (error) {
    next(error);
  }
};

export const getOrderRules = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderRules = await OrderRules.findOne().lean().select("-__v");
    res.json(orderRules);
  } catch (err) {
    next(err);
  }
};

export const getMostPopularBrands = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const mostPopularBrands = await Product.aggregate([
      {
        $group: {
          _id: "$brand",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $project: {
          _id: 0,
          brand: "$_id",
        },
      },
      {
        $limit: 20,
      },
    ]);
    res.json(mostPopularBrands.map((item) => item.brand));
  } catch (error) {
    next(error);
  }
};
