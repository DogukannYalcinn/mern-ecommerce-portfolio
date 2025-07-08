export type LegendItem = {
    label: string;
    className?: string;
    icon: React.ReactNode;
    value:string;
};

type Props = {
    items: LegendItem[];
    onClick?: (label: string) => void;
    className?: string;
};

const Legend = ({ items, onClick, className = "" }:Props) => {
    return (
        <div className={`flex gap-3 flex-wrap items-center ${className}`}>
            {items.map((item) => (
                <button
                    type="button"
                    key={item.value}
                    onClick={() => onClick?.(item.label)}
                    className={`
                        flex items-center gap-2 px-2 py-1 rounded-2xl shadow-sm transition hover:scale-105 focus:outline-none
                        ${item.className}
                    `}
                    style={{ cursor: onClick ? "pointer" : "default" }}
                >
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white bg-opacity-70">
                        {item.icon}
                    </span>
                    <span className="text-xs font-medium capitalize">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

export default Legend;