import { validationResult } from "express-validator";
import Product, { IProduct } from "../models/product";
import { NextFunction, Request, Response } from "express";
import Review from "../models/review";
import Category from "../models/category";
import { clearImages } from "../utils/clear.images";
import generateSlug from "../utils/generate.slug";

const calculateDiscountedPrice = (price: number, ratio: number): number => {
  return ratio > 0 && ratio < 100
    ? Number((price * ((100 - ratio) / 100)).toFixed(2))
    : 0;
};

//PUBLIC
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categorySlugs = req.query.categorySlugs
      ? (req.query.categorySlugs as string).split(",")
      : [];
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 25;
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Infinity;
    const sort = req.query.sort as string | undefined;
    const skip = (page - 1) * limit;

    const brands = req.query.brands
      ? (req.query.brands as string).split(",")
      : [];

    let query: Record<string, any> = {
      price: { $gte: minPrice, $lte: maxPrice },
    };

    const sortOptions: Record<string, 1 | -1> = {};
    switch (sort) {
      case "price_asc":
        sortOptions.price = 1;
        break;
      case "price_desc":
        sortOptions.price = -1;
        break;
      case "discount":
        Object.assign(query, {
          $and: [
            { discountedPrice: { $gt: 0 } },
            { discountedRatio: { $gt: 0 } },
          ],
        });
        break;
      case "best_seller":
        sortOptions["averageRating"] = -1;
        break;
      default:
        sortOptions.createdAt = -1;
        break;
    }

    if (categorySlugs.length > 0) {
      const matchedCategoryIds = await Category.find({
        slug: { $in: categorySlugs },
      }).distinct("_id");

      const childCategoryIds = await Category.find({
        parentId: { $in: matchedCategoryIds },
      }).distinct("_id");

      query.categoryIds = {
        $in: [...new Set([...matchedCategoryIds, ...childCategoryIds])],
      };
    }

    if (brands.length > 0) {
      query.brand = { $in: brands };
    }

    console.log(query);

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ ...sortOptions, _id: 1 })
      .skip(skip)
      .limit(limit);

    res.json({ totalCount, products });
  } catch (error) {
    next(error);
  }
};

export const getProductsByIds = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productIds: string[] = req.body.productIds;
    if (!productIds.length) return res.sendStatus(400);

    const productList: IProduct[] = await Product.find({
      _id: { $in: productIds },
    });

    if (productList.length === 0) {
      return res.status(404).json({ message: "No products found." });
    }

    res.status(200).json(productList);
  } catch (err) {
    next(err);
  }
};

export const fetchProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const slug = req.params.slug;
  if (!slug) return res.status(400);
  try {
    const product: IProduct | null = await Product.findOne({ slug }).lean();
    if (!product) {
      return res.status(400).json({ message: "Product is not found!" });
    }
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
};

export const getSearchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const filter = req.query.filter as string;
  const rawQuery = req.query.q as string;

  const searchTerms =
    rawQuery
      ?.split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "") || [];

  // if (searchTerms.length === 0) {
  //   return res
  //     .status(400)
  //     .json({ message: "At least one search term is required." });
  // }

  const limit = parseInt(req.query.limit as string) || 20;
  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * limit;

  let sort: Record<string, any> = {};
  let query: Record<string, any> = {};

  if (searchTerms.length > 0) {
    if (searchTerms.length > 0) {
      query.$text = { $search: searchTerms.join(" ") };
      sort = { score: { $meta: "textScore" } };
    }
  }
  // const query: Record<string, any> = {
  //   $text: { $search: searchTerms.join(" ") },
  // };

  // let sort: Record<string, any> = {
  //   score: { $meta: "textScore" },
  // };

  switch (filter) {
    case "latest":
      sort = { createdAt: -1 };
      break;

    case "popular":
      query.totalReviews = { $gt: 0 };
      break;

    case "boosted":
      query.isBoosted = true;
      break;

    case "low-stock":
      query.stock = { $lte: 5 };
      break;

    case "on-sale":
      query.$and = [
        { discountedRatio: { $gt: 0 } },
        { discountedPrice: { $gt: 0 } },
      ];
      break;
    default:
      sort = { createdAt: -1 };
      break;
  }

  try {
    const [products, totalCount] = await Promise.all([
      Product.find(query).skip(skip).limit(limit).sort(sort),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      products,
      totalCount,
    });
  } catch (err) {
    console.error("SearchProductsPage error:", err);
    next(err);
  }
};

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product Not Found!" });
    const productReviews = await Review.find({
      product: productId,
      comment: { $ne: null },
    })
      .populate({
        path: "user",
        select: "firstName lastName -_id createdAt",
      })
      .lean();

    res.status(200).json(productReviews);
  } catch (err) {
    next(err);
  }
};

export const getBestSeller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bestSellers = await Product.find()
      .sort({ averageRating: -1 })
      .limit(25);

    res.status(200).json(bestSellers);
  } catch (error) {
    next(error);
  }
};

export const getOnSale = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const onSaleProducts = await Product.find({
      $and: [{ discountedPrice: { $gt: 0 } }, { discountedRatio: { $gt: 0 } }],
    });

    res.status(200).json(onSaleProducts);
  } catch (error) {
    next(error);
  }
};

export const getFeatured = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const boostedProducts = await Product.find({ isBoosted: true });

    res.status(200).json(boostedProducts);
  } catch (error) {
    next(error);
  }
};

export const getNewArrivals = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const newArrivals = await Product.find()
      .sort({ createdAt: -1, _id: -1 })
      .limit(25);

    res.status(200).json(newArrivals);
  } catch (error) {
    next(error);
  }
};

//PUBLIC
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  const files = req.files as Express.Multer.File[];

  if (!errors.isEmpty()) {
    clearImages(files);
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, price, stock, discountedRatio, description, brand, tags } =
    req.body;

  let categorySlugs = req.body.categorySlugs;

  if (!Array.isArray(categorySlugs)) {
    categorySlugs = [categorySlugs];
  }

  const parsedPrice = Number(price);
  const parsedStock = Number(stock);
  const parsedRatio = discountedRatio ? Number(discountedRatio) : 0;
  const isBoosted = req.body.isBoosted === "true";

  if (!files || files.length === 0 || files.length > 5) {
    return res.status(422).json({ message: "Please upload 1–5 images." });
  }

  try {
    const categories = await Category.find({ slug: { $in: categorySlugs } });

    if (categorySlugs.length !== categories.length) {
      clearImages(files);
      return res.status(404).json({ message: "One of category not found!" });
    }

    const categoryIds = categories.map((category) => category._id);
    const slug = generateSlug(title);

    const calculatedDiscountedPrice = calculateDiscountedPrice(
      parsedPrice,
      parsedRatio,
    );

    const createdProduct = await Product.create({
      title,
      price: parsedPrice,
      stock: parsedStock,
      discountedRatio: parsedRatio,
      discountedPrice: calculatedDiscountedPrice,
      description,
      brand,
      tags,
      slug,
      isBoosted,
      categoryIds,
      images: files.map((file) => ({ url: file.filename })),
    });

    res.status(201).json({ createdProduct });
  } catch (err) {
    if (files.length > 0) clearImages(files);
    next(err);
  }
};

export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, price, stock, discountedRatio, description, brand, tags } =
    req.body;

  const productId = req.params.id;
  const files = req.files as Express.Multer.File[];

  const parsedPrice = Number(price);
  const parsedStock = Number(stock);
  const parsedRatio = discountedRatio ? Number(discountedRatio) : 0;
  const isBoosted = req.body.isBoosted === "true";

  let categorySlugs = req.body.categorySlugs;

  if (!Array.isArray(categorySlugs)) {
    categorySlugs = [categorySlugs];
  }

  const sanitizedDescription = description
    ? description
        .replace(/\r\n|\r|\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim()
    : null;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      clearImages(files);
      return res.status(404).json({ message: "Product not found" });
    }

    const categories = await Category.find({ slug: { $in: categorySlugs } });
    if (categories.length !== categorySlugs.length) {
      clearImages(files);
      return res
        .status(400)
        .json({ message: "One or more selected categories are invalid." });
    }

    const categoryIds = categories.map((category) => category._id);

    const totalImageCount = product.images.length + files.length;
    if (totalImageCount > 5) {
      clearImages(files);
      return res
        .status(422)
        .json({ message: "Please provide maximum 5 images" });
    } else if (totalImageCount === 0) {
      clearImages(files);
      return res
        .status(422)
        .json({ message: "Please provide minimum 1 image" });
    }

    // Update fields
    product.title = title;
    product.price = parsedPrice;
    product.stock = parsedStock;
    product.description = sanitizedDescription
      ? sanitizedDescription
      : product.description;
    product.brand = brand;
    product.tags = tags;
    product.isBoosted = isBoosted;
    product.categoryIds = categoryIds;
    product.discountedRatio = parsedRatio;
    product.discountedPrice = calculateDiscountedPrice(
      parsedPrice,
      parsedRatio,
    );

    // Append new images if any
    if (files.length > 0) {
      for (const file of files) {
        product.images.push({ url: file.filename });
      }
    }

    await product.save();

    return res.status(200).json(product);
  } catch (err) {
    clearImages(files);
    next(err);
  }
};

export const deleteProductImageById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const productId = req.params.productId;
  const imageId = req.params.imageId;

  if (!productId || !imageId) {
    return res.status(400).json({ message: "Invalid product or image ID" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.images.length === 1) {
      return res.status(400).json({
        message: "A product must have at least one image. Deletion denied.",
      });
    }

    const existImage = product.images.find((img) => img._id!.equals(imageId));
    if (!existImage) {
      return res.status(404).json({ message: "Image not found in product" });
    }

    product.images = product.images.filter((img) => !img._id!.equals(imageId));
    await product.save();
    clearImages(existImage.url);
    res.status(200).json({ message: "Product image deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json({ message: "Product deleted successfully" });
  try {
  } catch (err) {
    next(err);
  }
};
