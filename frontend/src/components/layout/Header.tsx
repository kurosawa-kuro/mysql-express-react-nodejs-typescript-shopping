import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuthStore } from "../../state/store";

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminIsOpen, setAdminIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const adminDropdownRef = useRef<HTMLDivElement | null>(null);
  const { userInfo, setCredentials } = useAuthStore();

  useEffect(() => {
    setCredentials({
      id: 2,
      name: "John Doe",
      email: "john@email.com",
      token: "JohnJohnJohn",
      isAdmin: true,
    });
  }, [setCredentials]);

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(e.target as Node)
      ) {
        setAdminIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  return (
    <header className="bg-custom-blue-dark py-3 text-custom-blue-lighter">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-custom-blue-lightest">
            Shop
          </span>
        </Link>
        <div className="sm:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className={`space-x-8 ${isOpen ? "block" : "hidden"} sm:flex`}>
          {/* The remaining part of your navigation items go here */}
          <Link
            to="/"
            className="block px-4 py-2 text-custom-blue-lightest hover:bg-custom-blue-lighter hover:text-custom-blue-extra-darkest"
            role="menuitem"
          >
            Home
          </Link>
          <Link
            to="/information-get"
            className="block px-4 py-2 text-custom-blue-lightest hover:bg-custom-blue-lighter hover:text-custom-blue-extra-darkest"
            role="menuitem"
          >
            InformationGet
          </Link>
          <Link
            to="/information-post"
            className="block px-4 py-2 text-custom-blue-lightest hover:bg-custom-blue-lighter hover:text-custom-blue-extra-darkest"
            role="menuitem"
          >
            InformationPost
          </Link>
          <Link
            to="/login"
            className="block px-4 py-2 text-custom-blue-lightest hover:bg-custom-blue-lighter hover:text-custom-blue-extra-darkest"
            role="menuitem"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="block px-4 py-2 text-custom-blue-lightest hover:bg-custom-blue-lighter hover:text-custom-blue-extra-darkest"
            role="menuitem"
          >
            Register
          </Link>

          {userInfo ? (
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <div>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-custom-blue-light hover:bg-custom-blue-lighter hover:text-custom-blue-extra-darkest"
                >
                  <FaUser className="h-5 w-5 text-custom-blue-lightest" />
                  <span
                    data-testid="user-info-name"
                    className="text-custom-blue-lightest hover:text-custom-blue-extra-darkest"
                  >
                    {userInfo.name}
                  </span>
                  {isOpen ? (
                    <FaChevronUp className="h-5 w-5 text-custom-blue-lightest" />
                  ) : (
                    <FaChevronDown className="h-5 w-5 text-custom-blue-lightest" />
                  )}
                </button>
              </div>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-custom-blue-darker shadow-lg ring-1 ring-custom-blue-darker">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-custom-blue-lighter hover:bg-custom-blue-darkest"
                      role="menuitem"
                    >
                      Profile
                    </Link>
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-custom-blue-lighter hover:bg-custom-blue-darkest"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-2 text-custom-blue-lighter"
            >
              <FaUser className="h-5 w-5 text-custom-blue-lightest" />
              <span className="text-custom-blue-lightest">Sign In</span>
            </Link>
          )}
          {userInfo && userInfo.isAdmin && (
            <div
              className="relative inline-block text-left"
              ref={adminDropdownRef}
            >
              <button
                type="button"
                onClick={() => setAdminIsOpen(!adminIsOpen)}
                className="flex items-center space-x-2 px-4 py-2 text-custom-blue-light hover:bg-custom-blue-lighter"
              >
                <span className="text-custom-blue-lightest hover:text-custom-blue-extra-darkest">
                  Admin Function
                </span>
                {adminIsOpen ? (
                  <FaChevronUp className="h-5 w-5 text-custom-blue-lightest" />
                ) : (
                  <FaChevronDown className="h-5 w-5 text-custom-blue-lightest" />
                )}
              </button>

              {adminIsOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-custom-blue-darker shadow-lg ring-1 ring-custom-blue-darker">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <Link
                      to="/admin/users"
                      className="block px-4 py-2 text-sm text-custom-blue-lighter hover:bg-custom-blue-darkest"
                      role="menuitem"
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block px-4 py-2 text-sm text-custom-blue-lighter hover:bg-custom-blue-darkest"
                      role="menuitem"
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block px-4 py-2 text-sm text-custom-blue-lighter hover:bg-custom-blue-darkest"
                      role="menuitem"
                    >
                      Orders
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
