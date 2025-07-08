const BoltIcon = ({
  className,
  ...rest
}: {
  className?: string;
  [key: string]: any;
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    fill="currentColor"
    aria-hidden="true"
    {...rest}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.5 4.5L6 14h7.5L10.5 21 18 11h-7.5l3-6.5z"
    />
  </svg>
);
export default BoltIcon;
