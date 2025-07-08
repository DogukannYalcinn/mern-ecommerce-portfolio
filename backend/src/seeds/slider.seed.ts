import Slider from "../models/slider";

const sliderSeed = async () => {
  const slider = await Slider.findOne({});
  if (slider) return console.log("slider already exists");
  const dummyData = [
    {
      title: "Huge Saving",
      subtitle: "on Gaming Laptops",
      description: "Sale up to 70% off on selected items*",
      imageUrl: "slider-laptop.png",
      link: "/products?categorySlugs=gaming-laptops",
    },
    {
      title: "Cinematic Experience",
      description: "Enjoy theater-like visuals with 4K Ultra HD TVs*",
      subtitle: "on UHD Televisions",
      imageUrl: "slider-tv.png",
      link: "/products?categorySlugs=smart-tv",
    },
    {
      title: "Maximum Efficiency",
      description: "Upgrade your tech lifestyle with accessories*",
      subtitle: "on Accessories",
      imageUrl: "slider-accessories.png",
      link: "/products?categorySlugs=accessories",
    },
    {
      title: "Smart Choice",
      description:
        "Track your health, stay connected, and redefine your daily routine*",
      subtitle: "on Smart Watches",
      imageUrl: "slider-smartWatch.png",
      link: "/products?categorySlugs=smart-watch",
    },
    {
      title: "Style Meets Function",
      description: "Experience crystal-clear sound and wireless freedom*",
      subtitle: "on Headphones",
      imageUrl: "slider-headphone.png",
      link: "/products?categorySlugs=headphones",
    },
  ];

  await Slider.insertMany(dummyData);
  console.log("slider seeded successfully.");
};
export default sliderSeed;
