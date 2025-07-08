import HourGlassIcon from "@icons/HourGlassIcon.tsx";
import ShoppingBagIcon from "@icons/ShoppingBag.tsx";
import TruckIcon from "@icons/TruckIcon.tsx";
import CheckBadgeIcon from "@icons/CheckBadgeIcon.tsx";
import CloseIcon from "@icons/CloseIcon.tsx";
import BadgeDollarSignIcon from "@icons/BadgeDollarSignIcon.tsx";

export const orderStatusTypes = [
  {
    identifier: "pending",
    label: "Pending",
    colorClasses: "bg-blue-100 text-blue-800",
    icon: <HourGlassIcon className="me-1 w-4 h-4" />,
  },
  {
    identifier: "placed",
    label: "Order Placed",
    colorClasses: "bg-amber-100 text-amber-800",
    icon: <ShoppingBagIcon className="h-5 w-5" />,
  },
  {
    identifier: "in_transit",
    label: "In Transit",
    colorClasses: "bg-blue-100 text-blue-800",
    icon: <TruckIcon className="h-5 w-5" />,
  },
  {
    identifier: "completed",
    label: "Completed",
    colorClasses: "bg-green-100 text-green-800",
    icon: <CheckBadgeIcon className="h-5 w-5" />,
  },
  {
    identifier: "cancelled",
    label: "Cancelled",
    colorClasses: "bg-red-100 text-red-800",
    icon: <CloseIcon className="h-5 w-5" />,
  },
  {
    identifier: "refund_request",
    label: "Refund Request",
    colorClasses: "bg-orange-100 text-orange-800",
    icon: <BadgeDollarSignIcon className="h-5 w-5" />,
  },
];
