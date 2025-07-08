import SearchIcon from "@icons/SearchIcon.tsx";

type Props = {
  title: string;
  subtitle: string;
};
const NoResults = ({ title, subtitle }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-gray-500">
      <SearchIcon className="w-12 h-12 mb-4 text-gray-400" />
      <p className="text-lg font-semibold capitalize">{title}</p>
      <p className="text-sm mt-2 text-gray-400 capitalize">{subtitle}</p>
    </div>
  );
};
export default NoResults;
