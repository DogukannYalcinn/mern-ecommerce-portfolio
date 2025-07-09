import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import Admin, { IAdmin } from "../models/admin";
import Product from "../models/product";
import Order from "../models/order";
import User from "../models/user";
import Notification from "../models/notification";
import Review from "../models/review";
import Slider from "../models/slider";
import Announcement from "../models/announcement";
import ContactForm from "../models/contact.form";
import OrderRules from "../models/order.rules";
import { clearImages } from "../utils/clear.images";

export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  const { password, username }: IAdmin = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({ validationErrors: errors.array() });
  }
  try {
    const existAdmin = await Admin.findOne({ username });

    if (!existAdmin) {
      return res.status(401).json({ message: "Admin does not exist" });
    }
    const isMatch = await bcrypt.compare(password, existAdmin.password);

    if (!isMatch) return res.sendStatus(401);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: existAdmin.username,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1h" },
    );

    res.cookie("jwt", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000,
    });
    res.json({ _id: existAdmin._id, username: existAdmin.username });
  } catch (err) {
    next(err);
  }
};

export const adminLogout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.status(200).json({ message: "Logout success" });
};

export const getAdminDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const currentMonthCompletedOrders = await Order.find({
    currentStatus: "completed",
    createdAt: {
      $gte: startOfMonth,
      $lt: startOfNextMonth,
    },
  }).select("total");
  const totalSales = currentMonthCompletedOrders.reduce(
    (sum, order) => sum + order.total,
    0,
  );

  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalPendingOrders = await Order.countDocuments({
    currentStatus: "pending",
  });
  const totalActivePromo = await Notification.countDocuments({ user: null });
  const totalComments = await Review.countDocuments({ comment: { $ne: null } });
  const totalRefundRequests = await Order.countDocuments({
    currentStatus: "refund_request",
  });

  const recentOrders = await Order.find()
    .populate([
      { path: "cart.product" },
      { path: "user", select: "firstName lastName" },
    ])
    .sort({ createdAt: -1 })
    .limit(5);

  const recentUsers = await User.find()
    .limit(5)
    .sort({ createdAt: -1 })
    .select("-password -refreshTokens")
    .populate([{ path: "cart.product" }]);
  const recentProducts = await Product.find().limit(5).sort({ createdAt: -1 });
  res.status(200).json({
    stats: {
      totalProducts,
      totalOrders,
      totalUsers,
      recentOrders,
      recentUsers,
      recentProducts,
      totalPendingOrders,
      totalComments,
      totalActivePromo,
      totalSales,
      totalRefundRequests,
    },
  });
};

// SLIDER CONTROLLERS

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

export const createSlider = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  const files = req.files as Express.Multer.File[];

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!files || files.length !== 1) {
    return res
      .status(422)
      .json({ message: "Please upload exactly one image." });
  }

  const { title, description, link, subtitle } = req.body;

  try {
    const newSlider = await Slider.create({
      title,
      description,
      link,
      subtitle,
      imageUrl: files[0].filename,
    });

    res.status(201).json(newSlider);
  } catch (err) {
    if (files.length > 0) clearImages(files);
    next(err);
  }
};

export const editSlider = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { title, subtitle, description, link } = req.body;
  const files = req.files as Express.Multer.File[];
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!files || files.length !== 1) {
    return res
      .status(422)
      .json({ message: "Please upload exactly one image." });
  }

  try {
    const slider = await Slider.findById(id);
    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    slider.title = title || slider.title;
    slider.subtitle = subtitle || slider.subtitle;
    slider.description = description || slider.description;
    slider.link = link || slider.link;

    if (files.length === 1) {
      slider.imageUrl = files[0].filename;
    }

    await slider.save();

    res.status(200).json(slider);
  } catch (err) {
    if (files?.length > 0) clearImages(files);
    next(err);
  }
};

export const deleteSlider = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const slider = await Slider.findById(id);
    if (!slider) {
      return res.status(404).json({ message: "Slider not found" });
    }

    clearImages(slider.imageUrl);
    await Slider.findByIdAndDelete(id);

    res.status(200).json({ message: "Slider deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// PROMO CONTROLLERS

export const getPromos = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const promos = await Notification.find({ user: null })
      .select("message link")
      .lean();
    res.status(200).json(promos);
  } catch (err) {
    next(err);
  }
};

export const createPromo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { message, link } = req.body;

  try {
    const newPromo = await Notification.create({
      type: "promo",
      message,
      link: link ?? null,
    });
    res.status(200).json(newPromo);
  } catch (err) {
    next(err);
  }
};

export const deletePromo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const promo = await Notification.findById(id);
    if (!promo) res.status(404).json({ message: "Promo not found!" });

    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Promo deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// ANNOUNCEMENT CONTROLLERS

export const getAnnouncements = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const announcements = await Announcement.find().lean();
    return res.status(201).json(announcements);
  } catch (err) {
    console.error("Error creating announcement:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { message } = req.body;
  const files = req.files as Express.Multer.File[];

  if (files?.length > 1) {
    return res
      .status(400)
      .json({ message: "Please upload exactly one image." });
  }
  const imageFile = files[0];
  const imagePath = imageFile.filename;

  try {
    await Announcement.updateMany({ isActive: true }, { isActive: false });

    const announcement = new Announcement({
      message,
      backgroundImage: imagePath,
      isActive: true,
    });

    await announcement.save();

    return res.status(201).json(announcement);
  } catch (err) {
    console.error("Error creating announcement:", err);
    if (files.length > 1) clearImages(files);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const toggleAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { isActive } = req.body;
  const announcementId = req.params.id;
  try {
    const announcement = await Announcement.findById(announcementId);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found." });
    }
    announcement.isActive = isActive;
    await announcement.save();

    if (isActive) {
      await Announcement.updateMany(
        { _id: { $ne: announcementId }, isActive: true },
        { isActive: false },
      );
    }
    res.status(200).json(announcement);
  } catch (err) {
    console.error("Error updating announcement status:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const deleteAnnouncement = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found." });
    }

    if (announcement.backgroundImage) {
      clearImages(announcement.backgroundImage);
    }

    await announcement.deleteOne();

    return res
      .status(200)
      .json({ message: "Announcement deleted successfully." });
  } catch (err) {
    console.error("Error deleting announcement:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

// CONTACT FORM CONTROLLERS
export const getContactForms = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const contactForms = await ContactForm.find()
      .sort({ isRead: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await ContactForm.countDocuments();

    res.status(200).json({
      total,
      data: contactForms,
    });
  } catch (error) {
    next(error);
  }
};
export const getUnreadContactFormCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const unreadContactCount = await ContactForm.countDocuments({ isRead: 0 });
    res.status(200).json({ count: unreadContactCount });
  } catch (error) {
    next(error);
  }
};
export const markContactAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const updatedContact = await ContactForm.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );

    if (!updatedContact) {
      return res.status(404).json({ message: "ContactPage form not found." });
    }

    res.status(200).json({
      success: true,
      message: "ContactPage marked as read.",
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const editOrderRules = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const update = req.body;
    const result = await OrderRules.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
};
