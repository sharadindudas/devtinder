import { Link } from "react-router";
import { FaCode } from "react-icons/fa";
import { useGlobalStore } from "../../store/useStore";
import useLogout from "../../hooks/useLogout";

const Header = () => {
    const { user } = useGlobalStore();
    const { handleLogout } = useLogout();
    const onLogout = async () => {
        await handleLogout();
    };

    return (
        <header className="min-h-16 px-3 sm:px-5 w-full bg-[#1a1a1d] shadow-md shadow-primary/30 text-neutral-content">
            <div className="navbar container mx-auto">
                <div className="flex-1">
                    <Link
                        to="/"
                        className="flex items-center gap-1 sm:gap-2 font-bold text-lg sm:text-xl">
                        <FaCode className="w-5 h-5 sm:h-6 sm:w-6" />
                        <span>DevTinder</span>
                    </Link>
                </div>
                {user ? (
                    <>
                        <p className="sm:block hidden mr-2 text-sm">
                            Welcome, <b>{user?.name}</b>
                        </p>
                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src={user.photoUrl}
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                                <p className="font-bold px-3">My Account</p>
                                <div className="divider m-0 mt-1"></div>
                                <div className="space-y-1">
                                    <li>
                                        <Link to="/profile">Profile</Link>
                                    </li>
                                    <li>
                                        <Link to="/requests">Requests</Link>
                                    </li>
                                    <li>
                                        <Link to="/connections">Connections</Link>
                                    </li>
                                    <li>
                                        <span onClick={onLogout}>Logout</span>
                                    </li>
                                </div>
                            </ul>
                        </div>
                    </>
                ) : (
                    <button className="btn btn-primary">
                        <Link to="/login">Log In</Link>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
