const HamburgerIcon = ({
  className,
  ...rest
}: {
  className: string;
  [key: string]: any;
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...rest}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      d="M5 5h14M5 12h14M5 19h14"
    />
  </svg>
);

export default HamburgerIcon;
