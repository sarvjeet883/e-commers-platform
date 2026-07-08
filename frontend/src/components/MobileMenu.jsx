import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import SearchBar from "./SearchBar";

const MobileMenu = ({
  navLinks,
  categories,
  isLoggedIn,
  handleLogout,
  handleUserClick,
  cartCount,
  handleClose,
}) => (
  /* Dropdown panel anchored below the navbar, aligned to the right */
  <div className="lg:hidden absolute top-full right-0 left-0 xs:left-auto xs:w-80 z-50 bg-white border border-gray-100 shadow-2xl xs:rounded-b-2xl xs:rounded-tl-2xl max-h-[calc(100vh-5rem)] overflow-y-auto animate-slide-down">
    <div className="px-4 py-4 space-y-2">
      {/* Product search */}
      <SearchBar className="mb-2" />

      {/* Main Navigation Links - Mobile optimized spacing */}
      <div className="space-y-1">
        {navLinks.map((item) =>
          item.label === "Categories" ? (
            <div key={item.label} className="py-1">
              <Link
                to={item.link}
                className="block text-gray-800 font-semibold text-base py-2 hover:text-pink-600 transition-colors duration-200"
                onClick={handleClose}
              >
                {item.label}
              </Link>
              
              {/* Categories Grid - Mobile optimized */}
              <div className="ml-3 mt-1 grid grid-cols-1 xs:grid-cols-2 gap-1">
                {categories.map((category) => (
                  <Link
                    key={category.label}
                    to={category.link}
                    className="text-gray-600 text-sm hover:text-pink-600 py-1.5 px-2 rounded hover:bg-gray-50 transition-all duration-200"
                    onClick={handleClose}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={item.label}
              to={item.link}
              className="block text-gray-800 font-medium text-base hover:text-pink-600 py-2 px-2 rounded hover:bg-gray-50 transition-all duration-200"
              onClick={handleClose}
            >
              {item.label}
            </Link>
          )
        )}
      </div>

      {/* Quiz CTA - Mobile optimized */}
      <div className="py-2">
        <Link to="/quiz" onClick={handleClose}>
          <button className="w-full bg-gradient-to-r from-pink-600 to-pink-700 text-white px-4 py-3 rounded-lg hover:from-pink-700 hover:to-pink-800 font-medium text-base shadow-md transition-all duration-200 active:scale-[0.98]">
            Know Your Skin
          </button>
        </Link>
      </div>

      {/* Authentication and Cart - Mobile optimized layout */}
      <div className="border-t border-gray-100 pt-3 mt-3">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
          {/* Auth Button */}
          <div className="flex-1">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  handleClose();
                }}
                className="w-full xs:w-auto text-red-600 font-medium py-2 px-3 rounded hover:bg-red-50 hover:text-red-700 transition-all duration-200 text-center"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  handleUserClick();
                  handleClose();
                }}
                className="w-full xs:w-auto text-gray-800 font-medium py-2 px-3 rounded hover:bg-gray-50 hover:text-pink-600 transition-all duration-200 text-center"
              >
                Login / Signup
              </button>
            )}
          </div>

          {/* Wishlist Button */}
          <Link
            to="/wishlist"
            className="flex items-center justify-center xs:justify-start gap-2 py-2 px-3 text-gray-800 hover:text-rose-600 hover:bg-rose-50 rounded transition-all duration-200"
            onClick={handleClose}
          >
            <FiHeart className="text-lg" />
            <span className="font-medium text-sm">Wishlist</span>
          </Link>

          {/* Cart Button - Mobile optimized */}
          <Link
            to="/cart"
            className="flex items-center justify-center xs:justify-start gap-2 py-2 px-3 text-gray-800 hover:text-pink-600 hover:bg-gray-50 rounded transition-all duration-200"
            onClick={handleClose}
          >
            <div className="relative">
              <FiShoppingCart className="text-lg" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium min-w-[16px]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="font-medium text-sm">Cart</span>
          </Link>
        </div>
      </div>
    </div>

  </div>
);

export default MobileMenu;