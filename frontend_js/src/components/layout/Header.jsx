// frontend\src\components\layout\Header.jsx

import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import SearchBox from '../features/SearchBox';
import logo from '../../assets/logo.png';
import { useAuthStore, useCartStore } from '../../state/store';
import { logoutUserApi } from '../../services/api';

const Header = () => {
  const { cartItems } = useCartStore();
  const { userInfo, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [adminIsOpen, setAdminIsOpen] = useState(false); // Admin dropdown state
  const dropdownRef = useRef(null);
  const adminDropdownRef = useRef(null); // Admin dropdown ref

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(e.target)) {
        setAdminIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeDropdown);
    return () => document.removeEventListener('mousedown', closeDropdown);
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutUserApi();
      logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className='bg-blue-500 text-white py-3'>
      <div className='container mx-auto px-4 flex items-center justify-between'>
        <Link to='/' className='flex items-center space-x-2'>
          {/* <img src={logo} alt='Shop' className='w-10 h-10' /> */}
          <span className='font-semibold text-xl'>Shop</span>
        </Link>
        <div className='flex items-center space-x-8'>
          <SearchBox />
          <Link to='/cart' className='flex items-center space-x-2'>
            <FaShoppingCart className='w-5 h-5' />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className='inline-block bg-green-500 rounded-full text-sm px-2'>
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>
          {userInfo ? (
            <div className='relative inline-block text-left' ref={dropdownRef}>
              <div>
                <button
                  type='button'
                  onClick={() => setIsOpen(!isOpen)}
                  className='flex items-center space-x-2'
                >
                  <FaUser className='w-5 h-5' />
                  <span data-testid="user-info-name">{userInfo.name}</span>
                  {isOpen ? (
                    <FaChevronUp className='w-5 h-5' />
                  ) : (
                    <FaChevronDown className='w-5 h-5' />
                  )}
                </button>
              </div>

              {isOpen && (
                <div className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
                  <div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
                    <Link to='/profile' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' role='menuitem'>
                      Profile
                    </Link>
                    <button onClick={logoutHandler} className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' role='menuitem'>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to='/login' className='flex items-center space-x-2'>
              <FaUser className='w-5 h-5' />
              <span>Sign In</span>
            </Link>
          )}
          {/* Admin Links */}
          {userInfo && userInfo.isAdmin && (
            <div className='relative inline-block text-left' ref={adminDropdownRef}>
              <button
                type='button'
                onClick={() => setAdminIsOpen(!adminIsOpen)}
                className='flex items-center space-x-2 text-gray-800'
              >
                <span>Admin Function</span>
                {adminIsOpen ? (
                  <FaChevronUp className='w-5 h-5' />
                ) : (
                  <FaChevronDown className='w-5 h-5' />
                )}
              </button>
              {adminIsOpen && (
                <div className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
                  <div className='py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
                    <Link to='/admin/product-list' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' role='menuitem'>
                      Products
                    </Link>
                    <Link to='/admin/order-list' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' role='menuitem'>
                      Orders
                    </Link>
                    <Link to='/admin/user-list' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' role='menuitem'>
                      Users
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

export default Header;
