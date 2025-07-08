type Props = {
    message?: string;
    className?: string;
};
const FormErrorMessage = ({ message, className = "" }:Props) => {
  return (
      <span
          className={`text-sm text-red-500 font-medium capitalize transition-opacity duration-700 ${
              message ? "opacity-100" : "opacity-0"
          } ${className}`}
          aria-live="polite"
      >
    {message}
  </span>
  );
};

export default FormErrorMessage;