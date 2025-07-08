import Product from "../models/product";
import Category from "../models/category";
import { Types } from "mongoose";

type ProductInput = {
  title: string;
  categoryIds: string; // this will be replaced with ObjectId later
  price: number;
  description: string;
  stock: number;
  images: { url: string }[];
};

type BrandMapping = {
  title: string;
  brand: string;
};

const seedProducts = async () => {
  const product = await Product.findOne({});

  if (product) return console.log("Product already exists");

  const dummyProduct: ProductInput[] = [
    {
      title: "Samsung Galaxy S24 Ultra",
      price: 1299,
      description: "Premium Android flagship with advanced AI features",
      stock: 50,
      images: [{ url: "smart-phone.png" }, { url: "smart-phone.png" }],
      categoryIds: "android",
    },
    {
      title: "Google Pixel 8 Pro",
      price: 999,
      description: "Google's flagship with exceptional camera capabilities",
      stock: 45,
      images: [{ url: "smart-phone.png" }, { url: "smart-phone.png" }],
      categoryIds: "android",
    },
    {
      title: "OnePlus 12",
      price: 899,

      description: "Fast charging flagship with Snapdragon processor",
      stock: 40,
      images: [{ url: "smart-phone.png" }, { url: "smart-phone.png" }],
      categoryIds: "android",
    },
    {
      title: "Xiaomi 14 Pro",
      price: 899,

      description: "Feature-rich flagship with Leica optics",
      stock: 35,
      images: [{ url: "smart-phone.png" }, { url: "smart-phone.png" }],
      categoryIds: "android",
    },
    {
      title: "ASUS ROG Phone 8",
      price: 1099,

      description: "Ultimate gaming phone with active cooling",
      stock: 30,
      images: [{ url: "smart-phone.png" }, { url: "smart-phone.png" }],
      categoryIds: "android",
    },

    {
      title: "iPhone 15 Pro Max",
      price: 1199,

      description: "Apple's premium smartphone with A17 Pro chip",
      stock: 50,
      images: [{ url: "ios-phone.png" }, { url: "ios-phone.png" }],
      categoryIds: "ios",
    },
    {
      title: "iPhone 15 Pro",
      price: 999,

      description: "Compact premium iPhone with titanium frame",
      stock: 45,
      images: [{ url: "ios-phone.png" }, { url: "ios-phone.png" }],
      categoryIds: "ios",
    },
    {
      title: "iPhone 15",
      price: 799,

      description: "Feature-rich iPhone with dynamic island",
      stock: 55,
      images: [{ url: "ios-phone.png" }, { url: "ios-phone.png" }],
      categoryIds: "ios",
    },
    {
      title: "iPhone 15 Plus",
      price: 899,

      description: "Large screen iPhone with great battery life",
      stock: 40,
      images: [{ url: "ios-phone.png" }, { url: "ios-phone.png" }],
      categoryIds: "ios",
    },
    {
      title: "iPhone 14",
      price: 699,

      description: "Reliable iPhone with powerful features",
      stock: 35,
      images: [{ url: "ios-phone.png" }, { url: "ios-phone.png" }],
      categoryIds: "ios",
    },

    {
      title: "ROG Zephyrus G14",
      price: 1699,

      description: "Compact gaming laptop with AMD Ryzen 9",
      stock: 25,
      images: [{ url: "gaming-laptop.png" }, { url: "gaming-laptop.png" }],
      categoryIds: "gaming-laptops",
    },
    {
      title: "Razer Blade 16",
      price: 2499,

      description: "Premium gaming laptop with RTX 4090",
      stock: 20,
      images: [{ url: "gaming-laptop.png" }, { url: "gaming-laptop.png" }],
      categoryIds: "gaming-laptops",
    },
    {
      title: "Alienware x16",
      price: 2299,

      description: "High-performance gaming laptop with advanced cooling",
      stock: 15,
      images: [{ url: "gaming-laptop.png" }, { url: "gaming-laptop.png" }],
      categoryIds: "gaming-laptops",
    },
    {
      title: "Legion Pro 7i",
      price: 1999,

      description: "Powerful gaming laptop with Intel Core i9",
      stock: 30,
      images: [{ url: "gaming-laptop.png" }, { url: "gaming-laptop.png" }],
      categoryIds: "gaming-laptops",
    },
    {
      title: "MSI Titan GT77",
      price: 2799,

      description: "Desktop replacement gaming laptop",
      stock: 10,
      images: [{ url: "gaming-laptop.png" }, { url: "gaming-laptop.png" }],
      categoryIds: "gaming-laptops",
    },

    {
      title: "MacBook Pro 16",
      price: 2499,

      description: "Powerful laptop with M3 Max chip",
      stock: 40,
      images: [
        { url: "workstation-laptop.png" },
        { url: "workstation-laptop.png" },
      ],
      categoryIds: "workstation-laptops",
    },
    {
      title: "Dell Precision 7680",
      price: 2299,

      description: "Professional workstation with NVIDIA RTX",
      stock: 25,
      images: [
        { url: "workstation-laptop.png" },
        { url: "workstation-laptop.png" },
      ],
      categoryIds: "workstation-laptops",
    },
    {
      title: "ThinkPad P1 Gen 5",
      price: 1999,

      description: "Reliable workstation with Intel Xeon",
      stock: 30,
      images: [
        { url: "workstation-laptop.png" },
        { url: "workstation-laptop.png" },
      ],
      categoryIds: "workstation-laptops",
    },
    {
      title: "HP ZBook Fury G9",
      price: 2399,

      description: "Professional mobile workstation",
      stock: 20,
      images: [
        { url: "workstation-laptop.png" },
        { url: "workstation-laptop.png" },
      ],
      categoryIds: "workstation-laptops",
    },
    {
      title: "MacBook Pro 14",
      price: 1999,

      description: "Compact professional laptop with M3 Pro",
      stock: 35,
      images: [
        { url: "workstation-laptop.png" },
        { url: "workstation-laptop.png" },
      ],
      categoryIds: "workstation-laptops",
    },
    {
      title: "NZXT H5 Flow Gaming PC",
      price: 1999,

      description: "Custom gaming PC with RTX 4070",
      stock: 20,
      images: [{ url: "computer.png" }, { url: "computer.png" }],
      categoryIds: "gaming-desktops",
    },
    {
      title: "Corsair ONE i300",
      price: 3499,

      description: "Compact premium gaming desktop",
      stock: 15,
      images: [{ url: "computer.png" }, { url: "computer.png" }],
      categoryIds: "gaming-desktops",
    },
    {
      title: "ROG GA35 Gaming Desktop",
      price: 2799,

      description: "High-end gaming desktop with AMD Ryzen",
      stock: 25,
      images: [{ url: "computer.png" }, { url: "computer.png" }],
      categoryIds: "gaming-desktops",
    },
    {
      title: "Alienware Aurora R15",
      price: 2499,

      description: "Premium gaming desktop with liquid cooling",
      stock: 20,
      images: [{ url: "computer.png" }, { url: "computer.png" }],
      categoryIds: "gaming-desktops",
    },
    {
      title: "MSI MEG Aegis Ti5",
      price: 3299,

      description: "Ultimate gaming desktop experience",
      stock: 10,
      images: [{ url: "computer.png" }, { url: "computer.png" }],
      categoryIds: "gaming-desktops",
    },

    {
      title: "Mac Studio M2 Ultra",
      price: 3999,

      description: "Professional desktop workstation",
      stock: 15,
      images: [
        { url: "workstation-desktop.png" },
        { url: "workstation-desktop.png" },
      ],
      categoryIds: "workstation-desktops",
    },
    {
      title: "Dell Precision 7920",
      price: 4499,

      description: "Dual CPU workstation for professionals",
      stock: 10,
      images: [
        { url: "workstation-desktop.png" },
        { url: "workstation-desktop.png" },
      ],
      categoryIds: "workstation-desktops",
    },
    {
      title: "HP Z6 G4 Workstation",
      price: 3799,

      description: "Professional desktop for content creation",
      stock: 12,
      images: [
        { url: "workstation-desktop.png" },
        { url: "workstation-desktop.png" },
      ],
      categoryIds: "workstation-desktops",
    },
    {
      title: "Lenovo ThinkStation P620",
      price: 4299,

      description: "AMD Threadripper workstation",
      stock: 8,
      images: [
        { url: "workstation-desktop.png" },
        { url: "workstation-desktop.png" },
      ],
      categoryIds: "workstation-desktops",
    },
    {
      title: "Mac Pro M2 Ultra",
      price: 6999,

      description: "Ultimate Apple professional workstation",
      stock: 5,
      images: [
        { url: "workstation-desktop.png" },
        { url: "workstation-desktop.png" },
      ],
      categoryIds: "workstation-desktops",
    },

    {
      title: "LG 27GP950-B",
      price: 799,

      description: "4K 144Hz Gaming Monitor",
      stock: 30,
      images: [{ url: "monitor.png" }, { url: "monitor.png" }],
      categoryIds: "monitors",
    },
    {
      title: "Samsung Odyssey G7",
      price: 699,

      description: "27-inch curved gaming monitor",
      stock: 35,
      images: [{ url: "monitor.png" }, { url: "monitor.png" }],
      categoryIds: "monitors",
    },
    {
      title: "Dell UltraSharp U3223QE",
      price: 899,

      description: "32-inch 4K USB-C Monitor",
      stock: 25,
      images: [{ url: "monitor.png" }, { url: "monitor.png" }],
      categoryIds: "monitors",
    },
    {
      title: "ASUS ProArt PA329CV",
      price: 999,

      description: "Professional 4K HDR Monitor",
      stock: 20,
      images: [{ url: "monitor.png" }, { url: "monitor.png" }],
      categoryIds: "monitors",
    },
    {
      title: "Apple Studio Display",
      price: 1599,

      description: "5K Retina display with camera",
      stock: 15,
      images: [{ url: "monitor.png" }, { url: "monitor.png" }],
      categoryIds: "monitors",
    },

    {
      title: "Sony A7 IV",
      price: 2499,

      description: "Full-frame mirrorless camera",
      stock: 20,
      images: [{ url: "camera.png" }, { url: "camera.png" }],
      categoryIds: "cameras",
    },
    {
      title: "Canon EOS R6 Mark II",
      price: 2499,

      description: "Professional mirrorless camera",
      stock: 15,
      images: [{ url: "camera.png" }, { url: "camera.png" }],
      categoryIds: "cameras",
    },
    {
      title: "Fujifilm X-T5",
      price: 1699,

      description: "Advanced APS-C mirrorless camera",
      stock: 25,
      images: [{ url: "camera.png" }, { url: "camera.png" }],
      categoryIds: "cameras",
    },
    {
      title: "Nikon Z6 II",
      price: 1999,

      description: "Versatile full-frame camera",
      stock: 18,
      images: [{ url: "camera.png" }, { url: "camera.png" }],
      categoryIds: "cameras",
    },
    {
      title: "Sony ZV-1 II",
      price: 799,

      description: "Vlogging and content creation camera",
      stock: 30,
      images: [{ url: "camera.png" }, { url: "camera.png" }],
      categoryIds: "cameras",
    },

    {
      title: "Logitech G Pro X Superlight",
      price: 159,

      description: "Ultra-lightweight gaming mouse",
      stock: 50,
      images: [
        { url: "gaming-accessories.png" },
        { url: "gaming-accessories.png" },
      ],
      categoryIds: "gaming-accessories",
    },
    {
      title: "SteelSeries Arctis Pro",
      price: 199,

      description: "High-fidelity gaming headset",
      stock: 40,
      images: [
        { url: "gaming-accessories.png" },
        { url: "gaming-accessories.png" },
      ],
      categoryIds: "gaming-accessories",
    },
    {
      title: "Razer Huntsman V2",
      price: 199,

      description: "Optical gaming keyboard",
      stock: 45,
      images: [
        { url: "gaming-accessories.png" },
        { url: "gaming-accessories.png" },
      ],
      categoryIds: "gaming-accessories",
    },
    {
      title: "Xbox Elite Controller Series 2",
      price: 179,

      description: "Premium gaming controller",
      stock: 35,
      images: [
        { url: "gaming-accessories.png" },
        { url: "gaming-accessories.png" },
      ],
      categoryIds: "gaming-accessories",
    },
    {
      title: "Elgato Stream Deck MK.2",
      price: 149,

      description: "Stream control interface",
      stock: 30,
      images: [
        { url: "gaming-accessories.png" },
        { url: "gaming-accessories.png" },
      ],
      categoryIds: "gaming-accessories",
    },

    {
      title: "Keychron Q1 Pro",
      price: 199,

      description: "Wireless mechanical keyboard",
      stock: 40,
      images: [{ url: "keyboard.png" }, { url: "keyboard.png" }],
      categoryIds: "keyboards",
    },
    {
      title: "GMMK Pro",
      price: 169,

      description: "Customizable mechanical keyboard",
      stock: 35,
      images: [{ url: "keyboard.png" }, { url: "keyboard.png" }],
      categoryIds: "keyboards",
    },
    {
      title: "Apple Magic Keyboard",
      price: 99,

      description: "Slim wireless keyboard",
      stock: 50,
      images: [{ url: "keyboard.png" }, { url: "keyboard.png" }],
      categoryIds: "keyboards",
    },
    {
      title: "Logitech MX Keys",
      price: 119,

      description: "Premium wireless keyboard",
      stock: 45,
      images: [{ url: "keyboard.png" }, { url: "keyboard.png" }],
      categoryIds: "keyboards",
    },
    {
      title: "Ducky One 3",
      price: 129,

      description: "High-quality mechanical keyboard",
      stock: 30,
      images: [{ url: "keyboard.png" }, { url: "keyboard.png" }],
      categoryIds: "keyboards",
    },

    {
      title: "Logitech MX Master 3S",
      price: 99,

      description: "Premium productivity mouse",
      stock: 55,
      images: [{ url: "mouse.png" }, { url: "mouse.png" }],
      categoryIds: "mouses",
    },
    {
      title: "Razer DeathAdder V3 Pro",
      price: 149,

      description: "Professional gaming mouse",
      stock: 45,
      images: [{ url: "mouse.png" }, { url: "mouse.png" }],
      categoryIds: "mouses",
    },
    {
      title: "Apple Magic Mouse",
      price: 79,

      description: "Touch-sensitive wireless mouse",
      stock: 60,
      images: [{ url: "mouse.png" }, { url: "mouse.png" }],
      categoryIds: "mouses",
    },
    {
      title: "Glorious Model O",
      price: 59,

      description: "Lightweight gaming mouse",
      stock: 50,
      images: [{ url: "mouse.png" }, { url: "mouse.png" }],
      categoryIds: "mouses",
    },
    {
      title: "Zowie EC2-C",
      price: 69,

      description: "Esports performance mouse",
      stock: 40,
      images: [{ url: "mouse.png" }, { url: "mouse.png" }],
      categoryIds: "mouses",
    },

    {
      title: "Apple Watch Series 9",
      price: 399,

      description: "Advanced smartwatch with health features",
      stock: 45,
      images: [{ url: "smart-watch.png" }, { url: "smart-watch.png" }],
      categoryIds: "smart-watch",
    },
    {
      title: "Samsung Galaxy Watch 6",
      price: 299,

      description: "Premium Android smartwatch",
      stock: 40,
      images: [{ url: "smart-watch.png" }, { url: "smart-watch.png" }],
      categoryIds: "smart-watch",
    },
    {
      title: "Garmin Fenix 7",
      price: 699,

      description: "Advanced multisport smartwatch",
      stock: 30,
      images: [{ url: "smart-watch.png" }, { url: "smart-watch.png" }],
      categoryIds: "smart-watch",
    },
    {
      title: "Fitbit Sense 2",
      price: 299,

      description: "Health-focused smartwatch",
      stock: 35,
      images: [{ url: "smart-watch.png" }, { url: "smart-watch.png" }],
      categoryIds: "smart-watch",
    },
    {
      title: "Google Pixel Watch 2",
      price: 349,

      description: "Wear OS smartwatch with Fitbit",
      stock: 25,
      images: [{ url: "smart-watch.png" }, { url: "smart-watch.png" }],
      categoryIds: "smart-watch",
    },

    {
      title: "Sony WH-1000XM5",
      price: 399,

      description: "Premium noise-cancelling headphones",
      stock: 40,
      images: [{ url: "head-phone.png" }, { url: "head-phone.png" }],
      categoryIds: "headphones",
    },
    {
      title: "AirPods Pro 2",
      price: 249,

      description: "Advanced wireless earbuds",
      stock: 50,
      images: [{ url: "head-phone.png" }, { url: "head-phone.png" }],
      categoryIds: "headphones",
    },
    {
      title: "Bose QuietComfort Ultra",
      price: 429,

      description: "Premium comfort headphones",
      stock: 35,
      images: [{ url: "head-phone.png" }, { url: "head-phone.png" }],
      categoryIds: "headphones",
    },
    {
      title: "Sennheiser Momentum 4",
      price: 349,

      description: "Audiophile wireless headphones",
      stock: 30,
      images: [{ url: "head-phone.png" }, { url: "head-phone.png" }],
      categoryIds: "headphones",
    },
    {
      title: "Samsung Galaxy Buds2 Pro",
      price: 229,

      description: "Premium Android wireless earbuds",
      stock: 45,
      images: [{ url: "head-phone.png" }, { url: "head-phone.png" }],
      categoryIds: "headphones",
    },
    {
      title: "Sonos Arc",
      price: 899,

      description: "Premium Dolby Atmos soundbar",
      stock: 25,
      images: [{ url: "soundbar.png" }, { url: "soundbar.png" }],
      categoryIds: "soundbars",
    },
    {
      title: "Samsung HW-Q990C",
      price: 1299,

      description: "11.1.4ch Dolby Atmos soundbar",
      stock: 20,
      images: [{ url: "soundbar.png" }, { url: "soundbar.png" }],
      categoryIds: "soundbars",
    },
    {
      title: "Bose Smart Soundbar 900",
      price: 799,

      description: "Premium smart soundbar",
      stock: 30,
      images: [{ url: "soundbar.png" }, { url: "soundbar.png" }],
      categoryIds: "soundbars",
    },
    {
      title: "JBL Bar 1000",
      price: 999,

      description: "Detachable surround soundbar",
      stock: 15,
      images: [{ url: "soundbar.png" }, { url: "soundbar.png" }],
      categoryIds: "soundbars",
    },
    {
      title: "Sennheiser Ambeo Soundbar Max",
      price: 1999,

      description: "All-in-one premium soundbar",
      stock: 10,
      images: [{ url: "soundbar.png" }, { url: "soundbar.png" }],
      categoryIds: "soundbars",
    },

    {
      title: "Denon AVR-X3800H",
      price: 1499,

      description: "9.4ch AV receiver",
      stock: 15,
      images: [{ url: "home-theater.png" }, { url: "home-theater.png" }],
      categoryIds: "home-theatre",
    },
    {
      title: "Klipsch Reference Theater Pack",
      price: 799,

      description: "5.1 speaker system",
      stock: 20,
      images: [{ url: "home-theater.png" }, { url: "home-theater.png" }],
      categoryIds: "home-theatre",
    },
    {
      title: "SVS PB-1000 Pro",
      price: 599,

      description: "Powered subwoofer",
      stock: 25,
      images: [{ url: "home-theater.png" }, { url: "home-theater.png" }],
      categoryIds: "home-theatre",
    },
    {
      title: "Marantz Cinema 70s",
      price: 1299,

      description: "8K AV receiver",
      stock: 12,
      images: [{ url: "home-theater.png" }, { url: "home-theater.png" }],
      categoryIds: "home-theatre",
    },
    {
      title: "Polk Audio 5.1 Bundle",
      price: 999,

      description: "Complete theater package",
      stock: 18,
      images: [{ url: "home-theater.png" }, { url: "home-theater.png" }],
      categoryIds: "home-theatre",
    },

    {
      title: "LG C3 65-inch OLED",
      price: 2499,

      description: "4K OLED Smart TV",
      stock: 20,
      images: [{ url: "smart-tv.png" }, { url: "smart-tv.png" }],
      categoryIds: "smart-tv",
    },
    {
      title: "Samsung QN90C 75-inch",
      price: 2999,

      description: "Neo QLED 4K Smart TV",
      stock: 15,
      images: [{ url: "smart-tv.png" }, { url: "smart-tv.png" }],
      categoryIds: "smart-tv",
    },
    {
      title: "Sony A95K 55-inch",
      price: 2799,

      description: "QD-OLED 4K Smart TV",
      stock: 12,
      images: [{ url: "smart-tv.png" }, { url: "smart-tv.png" }],
      categoryIds: "smart-tv",
    },
    {
      title: "TCL 6-Series 65-inch",
      price: 999,

      description: "QLED 4K Smart TV",
      stock: 25,
      images: [{ url: "smart-tv.png" }, { url: "smart-tv.png" }],
      categoryIds: "smart-tv",
    },
    {
      title: "Hisense U8K 65-inch",
      price: 1299,

      description: "Mini-LED 4K Smart TV",
      stock: 18,
      images: [{ url: "smart-tv.png" }, { url: "smart-tv.png" }],
      categoryIds: "smart-tv",
    },

    {
      title: "KEF LS50 Meta",
      price: 1499,

      description: "High-end bookshelf speakers",
      stock: 15,
      images: [{ url: "speaker.png" }, { url: "speaker.png" }],
      categoryIds: "speakers",
    },
    {
      title: "Sonos Five",
      price: 549,

      description: "Premium wireless speaker",
      stock: 30,
      images: [{ url: "speaker.png" }, { url: "speaker.png" }],
      categoryIds: "speakers",
    },
    {
      title: "B&W 606 S3",
      price: 899,

      description: "Audiophile bookshelf speakers",
      stock: 20,
      images: [{ url: "speaker.png" }, { url: "speaker.png" }],
      categoryIds: "speakers",
    },
    {
      title: "JBL PartyBox 710",
      price: 799,

      description: "Portable party speaker",
      stock: 25,
      images: [{ url: "speaker.png" }, { url: "speaker.png" }],
      categoryIds: "speakers",
    },
    {
      title: "Klipsch The Fives",
      price: 799,

      description: "Powered bookshelf speakers",
      stock: 22,
      images: [{ url: "speaker.png" }, { url: "speaker.png" }],
      categoryIds: "speakers",
    },
  ];

  const mapCategorySlugsToObjectIds = async (
    products: ProductInput[],
  ): Promise<
    (Omit<ProductInput, "categoryIds"> & { categoryIds: Types.ObjectId[] })[]
  > => {
    const slugs = [...new Set(products.map((p) => p.categoryIds))];

    const categories = await Category.find({ slug: { $in: slugs } });

    const slugToIdMap: Record<string, Types.ObjectId> = {};
    categories.forEach((cat) => {
      slugToIdMap[cat.slug] = cat._id as unknown as Types.ObjectId;
    });

    return products.map((p) => {
      const objectId = slugToIdMap[p.categoryIds];
      if (!objectId) {
        throw new Error(`Category slug not found: ${p.categoryIds}`);
      }

      return {
        ...p,
        categoryIds: [objectId],
      };
    });
  };

  const productWithCategoryIdsFinal =
    await mapCategorySlugsToObjectIds(dummyProduct);

  const mappedProducts = productWithCategoryIdsFinal.map((prd) => ({
    ...prd,
    slug: prd.title.trim().replace(/\s+/g, "-").toLowerCase(),
  }));

  // const brands = [
  //   "Samsung",
  //   "Apple",
  //   "Sony",
  //   "LG",
  //   "Panasonic",
  //   "Xiaomi",
  //   "Huawei",
  //   "Dell",
  //   "HP",
  //   "Asus",
  //   "Acer",
  //   "Lenovo",
  //   "Toshiba",
  //   "Microsoft",
  //   "Google",
  //   "OnePlus",
  //   "Nokia",
  //   "Philips",
  //   "Sharp",
  //   "Canon",
  //   "Epson",
  //   "Logitech",
  //   "Razer",
  //   "Intel",
  //   "AMD",
  //   "MSI",
  //   "NZXT",
  //   "Corsair",
  //   "Fujifilm",
  //   "Nikon",
  //   "SteelSeries",
  //   "Elgato",
  //   "Keychron",
  //   "Glorious",
  //   "Ducky",
  //   "Zowie",
  //   "Garmin",
  //   "Fitbit",
  //   "Bose",
  //   "Sennheiser",
  //   "Sonos",
  //   "JBL",
  //   "Denon",
  //   "Klipsch",
  //   "SVS",
  //   "Marantz",
  //   "Polk Audio",
  //   "TCL",
  //   "Hisense",
  //   "KEF",
  //   "Bowers & Wilkins",
  // ];

  const productBrandsMapping: BrandMapping[] = [
    // Smartphones
    {
      title: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
    },
    {
      title: "Google Pixel 8 Pro",
      brand: "Google",
    },
    {
      title: "OnePlus 12",
      brand: "OnePlus",
    },
    {
      title: "Xiaomi 14 Pro",
      brand: "Xiaomi",
    },
    {
      title: "ASUS ROG Phone 8",
      brand: "Asus",
    },
    {
      title: "iPhone 15 Pro Max",
      brand: "Apple",
    },
    {
      title: "iPhone 15 Pro",
      brand: "Apple",
    },
    {
      title: "iPhone 15",
      brand: "Apple",
    },
    {
      title: "iPhone 15 Plus",
      brand: "Apple",
    },
    {
      title: "iPhone 14",
      brand: "Apple",
    },

    // Gaming Laptops
    {
      title: "ROG Zephyrus G14",
      brand: "Asus",
    },
    {
      title: "Razer Blade 16",
      brand: "Razer",
    },
    {
      title: "Alienware x16",
      brand: "Dell",
    },
    {
      title: "Legion Pro 7i",
      brand: "Lenovo",
    },
    {
      title: "MSI Titan GT77",
      brand: "MSI",
    },

    // Workstation Laptops
    {
      title: "MacBook Pro 16",
      brand: "Apple",
    },
    {
      title: "Dell Precision 7680",
      brand: "Dell",
    },
    {
      title: "ThinkPad P1 Gen 5",
      brand: "Lenovo",
    },
    {
      title: "HP ZBook Fury G9",
      brand: "HP",
    },
    {
      title: "MacBook Pro 14",
      brand: "Apple",
    },

    // Gaming Desktops
    {
      title: "NZXT H5 Flow Gaming PC",
      brand: "NZXT",
    },
    {
      title: "Corsair ONE i300",
      brand: "Corsair",
    },
    {
      title: "ROG GA35 Gaming Desktop",
      brand: "Asus",
    },
    {
      title: "Alienware Aurora R15",
      brand: "Dell",
    },
    {
      title: "MSI MEG Aegis Ti5",
      brand: "MSI",
    },

    // Workstation Desktops
    {
      title: "Mac Studio M2 Ultra",
      brand: "Apple",
    },
    {
      title: "Dell Precision 7920",
      brand: "Dell",
    },
    {
      title: "HP Z6 G4 Workstation",
      brand: "HP",
    },
    {
      title: "Lenovo ThinkStation P620",
      brand: "Lenovo",
    },
    {
      title: "Mac Pro M2 Ultra",
      brand: "Apple",
    },

    // Monitors
    {
      title: "LG 27GP950-B",
      brand: "LG",
    },
    {
      title: "Samsung Odyssey G7",
      brand: "Samsung",
    },
    {
      title: "Dell UltraSharp U3223QE",
      brand: "Dell",
    },
    {
      title: "ASUS ProArt PA329CV",
      brand: "Asus",
    },
    {
      title: "Apple Studio Display",
      brand: "Apple",
    },

    // Cameras
    {
      title: "Sony A7 IV",
      brand: "Sony",
    },
    {
      title: "Canon EOS R6 Mark II",
      brand: "Canon",
    },
    {
      title: "Fujifilm X-T5",
      brand: "Fujifilm",
    },
    {
      title: "Nikon Z6 II",
      brand: "Nikon",
    },
    {
      title: "Sony ZV-1 II",
      brand: "Sony",
    },

    // Gaming Accessories
    {
      title: "Logitech G Pro X Superlight",
      brand: "Logitech",
    },
    {
      title: "SteelSeries Arctis Pro",
      brand: "SteelSeries",
    },
    {
      title: "Razer Huntsman V2",
      brand: "Razer",
    },
    {
      title: "Xbox Elite Controller Series 2",
      brand: "Microsoft",
    },
    {
      title: "Elgato Stream Deck MK.2",
      brand: "Elgato",
    },

    // Keyboards
    {
      title: "Keychron Q1 Pro",
      brand: "Keychron",
    },
    {
      title: "GMMK Pro",
      brand: "Glorious",
    },
    {
      title: "Apple Magic Keyboard",
      brand: "Apple",
    },
    {
      title: "Logitech MX Keys",
      brand: "Logitech",
    },
    {
      title: "Ducky One 3",
      brand: "Ducky",
    },

    // Mice
    {
      title: "Logitech MX Master 3S",
      brand: "Logitech",
    },
    {
      title: "Razer DeathAdder V3 Pro",
      brand: "Razer",
    },
    {
      title: "Apple Magic Mouse",
      brand: "Apple",
    },
    {
      title: "Glorious Model O",
      brand: "Glorious",
    },
    {
      title: "Zowie EC2-C",
      brand: "Zowie",
    },

    // Smart Watches
    {
      title: "Apple Watch Series 9",
      brand: "Apple",
    },
    {
      title: "Samsung Galaxy Watch 6",
      brand: "Samsung",
    },
    {
      title: "Garmin Fenix 7",
      brand: "Garmin",
    },
    {
      title: "Fitbit Sense 2",
      brand: "Fitbit",
    },
    {
      title: "Google Pixel Watch 2",
      brand: "Google",
    },

    // Headphones
    {
      title: "Sony WH-1000XM5",
      brand: "Sony",
    },
    {
      title: "AirPods Pro 2",
      brand: "Apple",
    },
    {
      title: "Bose QuietComfort Ultra",
      brand: "Bose",
    },
    {
      title: "Sennheiser Momentum 4",
      brand: "Sennheiser",
    },
    {
      title: "Samsung Galaxy Buds2 Pro",
      brand: "Samsung",
    },

    // Soundbars
    {
      title: "Sonos Arc",
      brand: "Sonos",
    },
    {
      title: "Samsung HW-Q990C",
      brand: "Samsung",
    },
    {
      title: "Bose Smart Soundbar 900",
      brand: "Bose",
    },
    {
      title: "JBL Bar 1000",
      brand: "JBL",
    },
    {
      title: "Sennheiser Ambeo Soundbar Max",
      brand: "Sennheiser",
    },

    // Home Theater
    {
      title: "Denon AVR-X3800H",
      brand: "Denon",
    },
    {
      title: "Klipsch Reference Theater Pack",
      brand: "Klipsch",
    },
    {
      title: "SVS PB-1000 Pro",
      brand: "SVS",
    },
    {
      title: "Marantz Cinema 70s",
      brand: "Marantz",
    },
    {
      title: "Polk Audio 5.1 Bundle",
      brand: "Polk Audio",
    },

    // Smart TVs
    {
      title: "LG C3 65-inch OLED",
      brand: "LG",
    },
    {
      title: "Samsung QN90C 75-inch",
      brand: "Samsung",
    },
    {
      title: "Sony A95K 55-inch",
      brand: "Sony",
    },
    {
      title: "TCL 6-Series 65-inch",
      brand: "TCL",
    },
    {
      title: "Hisense U8K 65-inch",
      brand: "Hisense",
    },

    // Speakers
    {
      title: "KEF LS50 Meta",
      brand: "KEF",
    },
    {
      title: "Sonos Five",
      brand: "Sonos",
    },
    {
      title: "B&W 606 S3",
      brand: "Bowers & Wilkins",
    },
    {
      title: "JBL PartyBox 710",
      brand: "JBL",
    },
    {
      title: "Klipsch The Fives",
      brand: "Klipsch",
    },
  ];

  const addBrandsToProducts = (
    products: typeof mappedProducts,
    brandsMapping: BrandMapping[],
  ) => {
    return products.map((product) => {
      const brandMapping = brandsMapping.find(
        (mapping) => mapping.title === product.title,
      );

      return {
        ...product,
        brand: brandMapping ? brandMapping.brand : null,
      };
    });
  };

  const productsWithBrands = addBrandsToProducts(
    mappedProducts,
    productBrandsMapping,
  );

  await Product.insertMany(productsWithBrands);
  console.log("Products seeded successfully!");
};

export default seedProducts;
