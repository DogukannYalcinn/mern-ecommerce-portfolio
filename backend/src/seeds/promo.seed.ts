import Notification from "../models/notification";
const promoSeed = async () => {
  const notification = await Notification.findOne({});
  if (notification) return console.log("Promo already exists");

  const dummyNotifications = [
    {
      user: null,
      message: "Exclusive promo! Get 20% off on your next order.",
      type: "promo",
      link: "/promotions",
    },
    {
      user: null,
      message: "Limited-time offer! Free shipping on all orders today.",
      type: "promo",
      link: "/promotions",
    },
    {
      user: null,
      message: "Flash sale! Up to 50% off on select items.",
      type: "promo",
      link: "/promotions",
    },
    {
      user: null,
      message: "Special deal! Buy 1 get 1 free on all drinks.",
      type: "promo",
      link: "/promotions",
    },
    {
      user: null,
      message: "New customer offer! Get $10 off your first order.",
      type: "promo",
      link: "/promotions",
    },
  ];
  await Notification.insertMany(dummyNotifications);
  console.log("promo seeded successfully.");
};
export default promoSeed;
