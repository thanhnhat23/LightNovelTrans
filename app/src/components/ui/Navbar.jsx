import { useAuthStore } from "../../store/useAuthStore.js";
import {
  BriefcaseBusiness,
  CircleEllipsisIcon,
  CircleUserIcon,
  House,
  LogIn,
  LogOut,
  Cat,
  Settings,
  PawPrint,
  MessageCircleMore,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const navigate = useNavigate();

  const [isBlur, setIsBlur] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsBlur(scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div
      className={`navbar fixed z-50 
        ${isBlur ? "backdrop-blur-md bg-white/60 text-black" : " bg-base-300"}`}
    >
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className={`text-sm menu menu-sm dropdown-content rounded-box z-[1] mt-4 
                        w-52 p-2 drop-shadow-md ${
                          isBlur ? "bg-white text-black" : "bg-base-300"
                        }`}
          >
            <li>
              <a href="/" className="text-base">
                <House className="mr-2 size-4" /> Homepage
              </a>
            </li>
            <li>
              <a className="text-base">
                <BriefcaseBusiness className="mr-2 size-4" />
                Portfolio
              </a>
            </li>
            <li>
              <a className="text-base">
                <CircleEllipsisIcon className="mr-2 size-4" />
                About
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a
          href="/"
          className="flex gap-2 text-xl font-extrabold tracking-[5px]"
        >
          NEK
          <Cat className="mt-0.5 -ml-2 mr-4" /> N
          <PawPrint className="mt-0.5 -ml-2 -mr-1" />
          RA
        </a>
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div
              className={`rounded-full w-20 ring-2 ring-offset-[3px]
                            ${
                              isBlur
                                ? "ring-black"
                                : "ring-white ring-offset-base-300"
                            }`}
            >
              <img alt="Profile" src={authUser?.profilePic || "/avatar.webp"} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className={`menu menu-sm dropdown-content rounded-box z-[1] mt-4 w-52 
                            p-2 drop-shadow-md ${
                              isBlur ? "bg-white text-black" : "bg-base-300"
                            }`}
          >
            {!authUser && (
              <li>
                <a href="/signup" className="text-base">
                  <LogIn className="mr-2 size-4" /> Sign up
                </a>
              </li>
            )}
            {authUser && (
              <>
                <li>
                  <a
                    href={`/profile/${encodeURIComponent(authUser?.nameTag)}`}
                    className="text-base"
                  >
                    <CircleUserIcon className="mr-2 size-4" /> Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li>
                  <a href="/chat-room" className="text-base">
                    <MessageCircleMore className="mr-2 size-4" /> Chat room
                  </a>
                </li>
                <li>
                  <a
                    className="text-base cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 size-4" /> Logout
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
