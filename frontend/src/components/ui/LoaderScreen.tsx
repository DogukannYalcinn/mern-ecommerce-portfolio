const LoaderScreen = () => {
  return (
    <div className="fixed inset-0 z-50 bg-gray-800 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4  p-8 rounded-lg">
        <img
          src="http://localhost:4000/images/plasarf-logo-200x58.png"
          alt="Loading"
          className="w-64 h-auto animate-pulse"
        />
        <div className="w-10 h-10 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin" />
      </div>
    </div>
  );
};
export default LoaderScreen;
