import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaShoppingCart,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuthStore, useCartStore } from "../../state/store";
import { logoutUserApi } from "../../services/api";

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [adminIsOpen, setAdminIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const adminDropdownRef = useRef<HTMLDivElement | null>(null);
  const { userInformation, logout } = useAuthStore();
  const { cartItems } = useCartStore();

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
          {!userInformation?.isAdmin && (
            <Link to="/cart" className="flex items-center space-x-2">
              <FaShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {cartItems.length > 0 && (
                <span className="inline-block rounded-full bg-green-500 px-2 text-sm">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
          )}

          {userInformation ? (
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
                    {userInformation.name}
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
                    {!userInformation.isAdmin && (
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-custom-blue-lighter hover:bg-custom-blue-darkest"
                        role="menuitem"
                      >
                        Orders
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-custom-blue-lighter hover:bg-custom-blue-darkest"
                      role="menuitem"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={async () => {
                        await logoutUserApi();
                        logout();
                        navigate("/login");
                      }}
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
          {userInformation && userInformation.isAdmin && (
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
                      to="/admin/products/"
                      className="block px-4 py-2 text-sm text-custom-blue-lighter hover:bg-custom-blue-darkest"
                      role="menuitem"
                    >
                      Products
                    </Link>
                    <Link
                      to="/admin/orders/"
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
