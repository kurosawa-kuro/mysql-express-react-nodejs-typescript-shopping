// frontend\src\components\layout\Header.tsx

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchBox } from "../features/SearchBox";

import {
  FaUser,
  FaShoppingCart,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuthStore, useCartStore } from "../../state/store";
import { logoutUser } from "../../services/api";

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [adminIsOpen, setAdminIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const adminDropdownRef = useRef<HTMLDivElement | null>(null);
  const { userInfo, logout } = useAuthStore();
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
      <div className="container mx-auto flex items-center justify-between ">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-custom-blue-lightest">
            TypeScriptShop
          </span>
        </Link>
        <div className="sm:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className={`space-x-8 ${isOpen ? "block" : "hidden"} sm:flex`}>
          <SearchBox />
          {!userInfo?.isAdmin && (
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

          {userInfo ? (
            <div className="relative inline-block text-left" ref={dropdownRef}>
              <div className="group">
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-custom-blue-light hover:bg-custom-blue-lighter hover:text-custom-blue-extra-darkest"
                >
                  <FaUser className="h-5 w-5 text-custom-blue-lightest group-hover:text-custom-blue-extra-darkest" />
                  <span
                    data-testid="user-info-name"
                    className="text-custom-blue-lightest group-hover:text-custom-blue-extra-darkest"
                  >
                    {userInfo.name}
                  </span>
                  {isOpen ? (
                    <FaChevronUp className="h-5 w-5 text-custom-blue-lightest group-hover:text-custom-blue-extra-darkest" />
                  ) : (
                    <FaChevronDown className="h-5 w-5 text-custom-blue-lightest group-hover:text-custom-blue-extra-darkest" />
                  )}
                </button>
              </div>

              {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-custom-blue-darker shadow-lg ring-1 ring-custom-blue-darker">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    {!userInfo.isAdmin && (
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
                        await logoutUser();
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
              <span className="text-custom-blue-lightest">Log In</span>
            </Link>
          )}
          {userInfo && userInfo.isAdmin && (
            <div
              className="relative inline-block text-left"
              ref={adminDropdownRef}
            >
              <div className="group">
                <button
                  type="button"
                  onClick={() => setAdminIsOpen(!adminIsOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-custom-blue-light hover:bg-custom-blue-lighter group-hover:text-custom-blue-extra-darkest"
                >
                  <span className="text-custom-blue-lightest group-hover:text-custom-blue-extra-darkest">
                    Admin Function
                  </span>
                  {adminIsOpen ? (
                    <FaChevronUp className="h-5 w-5 text-custom-blue-lightest group-hover:text-custom-blue-extra-darkest" />
                  ) : (
                    <FaChevronDown className="h-5 w-5 text-custom-blue-lightest group-hover:text-custom-blue-extra-darkest" />
                  )}
                </button>
              </div>

              {adminIsOpen && (
                <div className="absolute  right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-custom-blue-darker shadow-lg ring-1 ring-custom-blue-darker">
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
