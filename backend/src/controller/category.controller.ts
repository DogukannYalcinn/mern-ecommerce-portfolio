import { Request, Response, NextFunction } from "express";
import Category from "../models/category";
import { clearImages } from "../utils/clear.images";
import { validationResult } from "express-validator";
import generateSlug from "../utils/generate.slug";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await Category.aggregate([
      { $match: { parentId: null } },
      {
        $lookup: {
          from: "categories",
          let: { parentId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$parentId", "$$parentId"] } } },
            { $project: { _id: 1, name: 1, imageUrl: 1, slug: 1 } },
          ],
          as: "children",
        },
      },
      { $project: { _id: 1, name: 1, children: 1, imageUrl: 1, slug: 1 } },
    ]);
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, parentId } = req.body;
  const errors = validationResult(req);
  const files = req.files as Express.Multer.File[];

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (files.length !== 1) {
    return res.status(422).json({ message: "Please upload exactly 1 image." });
  }

  if (parentId) {
    const parentExists = await Category.findById(parentId);
    if (!parentExists) {
      return res.status(400).json({ message: "Invalid parent category ID." });
    }
  }
  const categorySlug = generateSlug(name);
  try {
    const newCategory = await Category.create({
      slug: categorySlug,
      name,
      parentId: parentId || null,
      imageUrl: files[0].filename,
    });
    res.status(201).json(newCategory);
  } catch (err) {
    if (files.length > 0) clearImages(files);
    next(err);
  }
};

export const editCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { name } = req.body;
  const errors = validationResult(req);
  const files = (req.files as Express.Multer.File[]) || [];

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (files.length > 1) {
    return res.status(400).json({ message: "Please upload only 1 image." });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (files.length === 1) {
      if (category.imageUrl) clearImages(category.imageUrl);
      category.imageUrl = files[0].filename;
    }

    if (name) {
      category.name = name;
      category.slug = generateSlug(name);
    }
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    if (files.length > 0) clearImages(files);
    next(err);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!category.parentId) {
      const childCategories = await Category.find({ parentId: category._id });

      const childImageUrls = childCategories
        .map((child) => child.imageUrl)
        .filter(Boolean);

      await Category.deleteMany({ parentId: category._id });

      if (childImageUrls.length > 0) {
        clearImages(childImageUrls);
      }
    }

    await category.deleteOne();
    if (category.imageUrl) {
      clearImages(category.imageUrl);
    }
    res
      .status(200)
      .json({ message: "Category and its children deleted (if any)" });
  } catch (err) {
    next(err);
  }
};
