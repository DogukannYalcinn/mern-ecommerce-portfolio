import Category from "../models/category";
import { Types } from "mongoose";
const categorySeed = async () => {
  const category = await Category.findOne({});
  if (category) return console.log("category already exists");

  const rawCategories = [
    // TV and its children
    {
      name: "Tv&Audio",
      parentId: null,
      imageUrl: "smart-tv.png",
      slug: "tv-audio",
    },
    {
      name: "Soundbars",
      parentId: "tv-audio",
      imageUrl: "soundbar.png",
      slug: "soundbars",
    },
    {
      name: "Home Theatre",
      parentId: "tv-audio",
      imageUrl: "home-theater.png",
      slug: "home-theatre",
    },
    {
      name: "Smart Tv",
      parentId: "tv-audio",
      imageUrl: "smart-tv.png",
      slug: "smart-tv",
    },
    {
      name: "Speakers",
      parentId: "tv-audio",
      imageUrl: "speaker.png",
      slug: "speakers",
    },

    // SmartPhone and its children
    {
      name: "Smart Phones",
      parentId: null,
      imageUrl: "smart-phone.png",
      slug: "smart-phones",
    },
    {
      name: "Android Phones",
      parentId: "smart-phones",
      imageUrl: "smart-phone.png",
      slug: "android",
    },
    {
      name: "iOS Phones",
      parentId: "smart-phones",
      imageUrl: "ios-phone.png",
      slug: "ios",
    },
    {
      name: "Head Phones",
      parentId: "smart-phones",
      imageUrl: "head-phone.png",
      slug: "headphones",
    },
    {
      name: "Smart Watch",
      parentId: "smart-phones",
      imageUrl: "smart-watch.png",
      slug: "smart-watch",
    },

    // Computers and all its children
    {
      name: "Computers",
      parentId: null,
      imageUrl: "computer.png",
      slug: "computers",
    },
    {
      name: "Gaming Laptops",
      parentId: "computers",
      imageUrl: "gaming-laptop.png",
      slug: "gaming-laptops",
    },
    {
      name: "Workstation Laptops",
      parentId: "computers",
      imageUrl: "workstation-laptop.png",
      slug: "workstation-laptops",
    },
    {
      name: "Gaming Desktops",
      parentId: "computers",
      imageUrl: "computer.png",
      slug: "gaming-desktops",
    },
    {
      name: "Workstation Desktops",
      parentId: "computers",
      imageUrl: "workstation-desktop.png",
      slug: "workstation-desktops",
    },
    {
      name: "Monitors",
      parentId: "computers",
      imageUrl: "monitor.png",
      slug: "monitors",
    },

    // Accessories subcategories
    {
      name: "Accessories",
      parentId: null,
      imageUrl: "accessories.png",
      slug: "accessories",
    },
    {
      name: "Cameras",
      parentId: "accessories",
      imageUrl: "camera.png",
      slug: "cameras",
    },
    {
      name: "Gaming Accessories",
      parentId: "accessories",
      imageUrl: "gaming-accessories.png",
      slug: "gaming-accessories",
    },
    {
      name: "Keyboards",
      parentId: "accessories",
      imageUrl: "keyboard.png",
      slug: "keyboards",
    },
    {
      name: "Mouses",
      parentId: "accessories",
      imageUrl: "mouse.png",
      slug: "mouses",
    },
  ];

  const parentCategories = rawCategories.filter((cat) => cat.parentId === null);
  const childCategories = rawCategories.filter((cat) => cat.parentId !== null);

  const insertedParents = await Category.insertMany(parentCategories);

  const slugToIdMap = insertedParents.reduce(
    (map, cat) => {
      map[cat.slug] = cat._id as unknown as Types.ObjectId;
      return map;
    },
    {} as Record<string, Types.ObjectId>,
  );

  const processedChildren = childCategories.map((cat) => ({
    ...cat,
    parentId: slugToIdMap[cat.parentId as string],
  }));

  await Category.insertMany(processedChildren);
  console.log("category seeded successfully!");
};
export default categorySeed;
