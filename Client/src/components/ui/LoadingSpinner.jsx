/**
 * Loading Spinner Component
 */
const LoadingSpinner = ({ size = "medium", className = "" }) => {
  const sizes = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };

  return (
    <div
      className={`${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin ${className}`}
    ></div>
  );
};

export default LoadingSpinner;
