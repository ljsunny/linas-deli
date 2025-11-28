import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-[#FFFAEF] text-black px-4">
      <div className="max-w-md text-center animate-fade-in">
        <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-400 drop-shadow-lg mb-6">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-black mb-6">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-[#AD343E] hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 shadow-lg"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
