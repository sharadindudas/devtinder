import { Link } from "react-router";

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center flex-1 px-4 text-center text-neutral-content">
            <h2 className="text-3xl md:text-5xl font-bold">404 - Page Not Found</h2>
            <p className="text-base md:text-lg font-semibold mt-3 mb-4 max-w-md">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
                to="/"
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold text-sm md:text-base shadow-md hover:bg-gray-200 transition">
                Return to Home
            </Link>
        </div>
    );
};

export default NotFound;
