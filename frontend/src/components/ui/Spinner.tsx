const Spinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-white border-solid border-transparent"></div>
    </div>
  );
};

export default Spinner;
