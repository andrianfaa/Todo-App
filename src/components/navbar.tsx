/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useAppDispatch, useAppSelector } from "app";
import { Logo } from "assets";
import { logout } from "features/auth";
import { useState } from "react";
import { FaUserAstronaut } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";

function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => dispatch(logout());

  return (
    <nav className="border-b border-b-slate-100">
      <div className="container mx-auto px-6 h-16 md:h-20 flex flex-row justify-between items-center">
        <Logo className="w-8 text-primary" />

        <div className="flex flex-row items-center relative min-w-[150px] justify-end">
          <span
            className={`hidden md:inline mr-3 font-semibold hover:text-primary hover:cursor-pointer ${isOpen ? "text-primary" : ""}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {user?.name ?? "User"}
          </span>

          <FaUserAstronaut
            className={`w-6 h-6 hover:text-primary hover:cursor-pointer ${isOpen ? "text-primary" : ""}`}
            title={user?.name ?? "User"}
            onClick={() => setIsOpen(!isOpen)}
          />

          {isOpen && (
            <div className="absolute right-0 top-16 shadow-lg shadow-slate-200 bg-white border border-slate-100 rounded py-4 px-6 flex flex-col justify-center items-center text-center">
              <FaUserAstronaut className="md:hidden hover:text-primary hover:cursor-pointer inline-block w-auto text-5xl mb-4" title={user?.name ?? "User"} />
              <span className="md:hidden font-semibold text-sm text-gray-600 mr-2 whitespace-nowrap">
                {user?.name ?? "User"}
              </span>
              <span className="text-sm md:hidden">
                {user?.email ?? ""}
              </span>

              <button
                type="button"
                className="button-base button-danger inline-block mt-4 md:mt-0 whitespace-nowrap"
                title="Logout"
                onClick={handleLogout}
              >
                <span>
                  <HiOutlineLogout className="inline align-middle mr-2 text-lg" />
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
