import { NavLink } from "react-router-dom";
import CirclePlusIcon from "@icons/CirclePlusIcon.tsx";

type Props = {
  label: string;
  description?: string;
  fee?: number;
  selected: boolean;
  onSelect: () => void;
  isAddMode?: boolean;
  addLink?: string;
};

const OptionCart = ({
  label,
  description,
  fee,
  selected,
  onSelect,
  isAddMode,
  addLink,
}: Props) => {
  if (isAddMode && addLink) {
    return (
      <NavLink to={addLink}>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-4 cursor-pointer text-blue-500">
          <CirclePlusIcon className="h-4 w-4 mr-2" />
          <span className="text-lg tracking-wide hover:underline">
            Add {label}
          </span>
        </div>
      </NavLink>
    );
  }

  return (
    <div
      className={`flex ga rounded-lg border bg-gray-50 p-4 cursor-pointer ${
        selected ? " border-blue-500 shadow " : " border-gray-200"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start">
        <div className="flex h-5 items-center">
          <input
            type="radio"
            id={label}
            name={label}
            className="h-4 w-4 border-gray-300 bg-white text-blue-600 cursor-pointer"
            checked={selected}
            readOnly
          />
        </div>
        <div className="ms-4 text-sm">
          <label
            htmlFor={label}
            className="font-medium leading-none text-gray-900 cursor-pointer"
          >
            {label}{" "}
            {fee !== undefined && fee > 0 && (
              <span className="text-xs text-blue-500">({fee}$)</span>
            )}
          </label>
          {description && (
            <p className="mt-1 text-xs font-normal text-gray-500">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptionCart;
