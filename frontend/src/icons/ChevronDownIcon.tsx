const ChevronDownIcon = ({
  className,
  ...rest
}: {
  className: string;
  [key: string]: any;
}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      {...rest}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m8 10 4 4 4-4"
      />
    </svg>
  );
};
export default ChevronDownIcon;
