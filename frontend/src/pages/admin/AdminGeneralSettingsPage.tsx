import { useRef, useState } from "react";
import CategoryManager from "@pages/admin/CategoryManager.tsx";
import SliderManager from "@pages/admin/SliderManager.tsx";
import NotificationManager from "@pages/admin/NotificationManager.tsx";
import Spinner from "@components/ui/Spinner.tsx";
import AnnouncementManager from "@pages/admin/AnnouncementManager.tsx";
import Legend, { LegendItem } from "@pages/admin/Legend.tsx";
import CategoryIcon from "@icons/CategoryIcon.tsx";
import ImageIcon from "@icons/ImageIcon.tsx";
import BellIcon from "@icons/BellIcon.tsx";
import HornIcon from "@icons/HornIcon.tsx";

export type AdminGeneralSettingProps = {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const LEGEND_ITEMS: LegendItem[] = [
  {
    label: "categories",
    className: "bg-purple-300 text-purple-700",
    icon: <CategoryIcon className="w-5 h-5" />,
    value: "category",
  },
  {
    label: "sliders",
    className: "bg-green-200 text-green-600",
    icon: <ImageIcon className="w-5 h-5" />,
    value: "slider",
  },
  {
    label: "promotions",
    className: "bg-yellow-200 text-yellow-600",
    icon: <BellIcon className="w-5 h-5" />,
    value: "promotion",
  },
  {
    label: "announcements",
    className: "bg-red-300 text-red-600",
    icon: <HornIcon className="w-5 h-5" />,
    value: "announcement",
  },
];

const AdminGeneralSettingsPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const promoRef = useRef<HTMLDivElement>(null);
  const announcementRef = useRef<HTMLDivElement>(null);

  const handleLegendClick = (label: string) => {
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: "smooth",
      block: "start",
    };

    switch (label) {
      case "categories":
        categoryRef.current?.scrollIntoView(scrollOptions);
        break;
      case "sliders":
        sliderRef.current?.scrollIntoView(scrollOptions);
        break;
      case "promotions":
        promoRef.current?.scrollIntoView(scrollOptions);
        break;
      case "announcements":
        announcementRef.current?.scrollIntoView(scrollOptions);
        break;
    }
  };

  return (
    <main className="min-h-screen relative py-4">
      {isLoading && <Spinner />}
      <div className="space-y-10 w-full max-w-7xl mx-auto divide-y-2 divide-gray-100">
        <div className="flex justify-between sticky top-0 z-10  shadow-sm p-4 bg-blue-200 rounded">
          <h1 className="text-2xl font-bold text-center">General Settings</h1>
          <Legend items={LEGEND_ITEMS} onClick={handleLegendClick} />
        </div>

        <section ref={categoryRef}>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight mt-20">
            Categories
          </h2>
          <CategoryManager setIsLoading={setIsLoading} />
        </section>

        <section ref={sliderRef}>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight mt-20">
            Hero Sliders
          </h2>
          <SliderManager setIsLoading={setIsLoading} />
        </section>

        <section ref={promoRef}>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight mt-20">
            Promo Notifications
          </h2>
          <NotificationManager setIsLoading={setIsLoading} />
        </section>

        <section ref={announcementRef}>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight mt-20">
            Announcement Center
          </h2>
          <AnnouncementManager setIsLoading={setIsLoading} />
        </section>
      </div>
    </main>
  );
};
export default AdminGeneralSettingsPage;
