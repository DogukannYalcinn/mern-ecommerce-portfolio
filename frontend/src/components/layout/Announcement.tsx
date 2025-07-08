import { useEffect, useState } from "react";
import generalApi from "@api/generalApi.ts";
import FireIcon from "../../icons/FireIcon.tsx";

export type Announcement = {
  message: string;
  backgroundImage: string;
};
const Announcement = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await generalApi.fetchActiveAnnouncement();
        setAnnouncement(res);
      } catch (error) {
        console.error("Failed to load announcements", error);
      }
    };

    fetchAnnouncements();
  }, []);

  if (!announcement) return null;

  return (
    <div className="relative overflow-hidden py-2 bg-gray-100">
      {/* Background Image */}
      <img
        src={`http://localhost:4000/images/${announcement.backgroundImage}`}
        alt="announcement background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Marquee Layer */}
      <div className="relative z-10">
        <div className="flex w-max animate-marquee gap-24 whitespace-nowrap px-4">
          {[...Array(12)].map((_, i) => (
            <div className="flex gap-24" key={i}>
              <div className="flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-red-600 shrink-0" />
                <p className="uppercase tracking-wider font-semibold text-sm md:text-base text-gray-900 drop-shadow-sm">
                  {announcement.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Announcement;
