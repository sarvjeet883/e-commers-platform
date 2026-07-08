import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegUser } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { FiHeart } from "react-icons/fi";
import AuthModal from "./AuthModal";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";
import ProfileDropdown from './ProfileDropdown'
import SearchBar from "./SearchBar";
import { signup, login } from "../api";
import { useCart } from "../context/ProductContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext"; // Uncomment if using AuthContext


const Navbar = () => {
  const { products } = useCart();
  const { wishlist } = useWishlist();
   const userLogin = useAuth().login;
   const userLogout = useAuth().logout;
 

  const [userData, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [isFormOpen, setIsFormOpen] = useState(false); // Auth modal
  const [isLoginForm, setIsLoginForm] = useState(true); // Login/signup toggle
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navLinks = [
    { link: "/ourproducts", label: "Our Products" },
    { link: "/reviews", label: "Reviews" },
    { link: "/myorders", label: "My Orders" },
    { link: "/categories", label: "Categories" },
  ];

  const categories = [
    { label: "Oily Skin", link: "/categories/oilyskin" },
    { label: "Normal Skin", link: "/categories/normalskin" },
    { label: "Sensitive Skin", link: "/categories/sensitiveskin" },
    { label: "Combination Skin", link: "/categories/combinationskin" },
    { label: "Dry Skin", link: "/categories/dryskin" },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const handleUserClick = () => setIsFormOpen(!isFormOpen);
  const handleFormToggle = () => setIsLoginForm(!isLoginForm);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginForm) {
      
      try {
        const response = await login({
          email: formData.email,
          password: formData.password,
        });
        const user = {
          email: response.user?.email || formData.email,
          token: response.token,
          name: response.user?.name || "User",
          role: response.user?.role || "user",
        };
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userData", JSON.stringify(user));
        setUserData(user);
        toast.success("Login successful!");
        userLogin(true);
      } catch (error) {
        toast.error(error.message || "Login failed");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      try {
        await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        toast.success("Signup successful!");
      } catch (error) {
        toast.error(error.message || "Signup failed");
      }
    }
    setIsFormOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    setUserData(null);
    toast.success("Logged out successfully!");
    userLogout();
  };

  return (
    <>
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-gray-200/70 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-1.5 group">
            <span className="text-2xl sm:text-3xl font-bold font-serif bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:to-teal-400 transition-all duration-300">
              EcoGlam
            </span>
            <span className="text-emerald-500 text-lg leading-none -mt-2">✦</span>
          </Link>


          {/* Desktop search */}
          <SearchBar className="hidden md:block flex-1 max-w-xs xl:max-w-sm mx-4 lg:mx-6" />

          {/* Desktop Links */}
          <div className="hidden lg:flex lg:items-center space-x-3">
            <NavLinks navLinks={navLinks} categories={categories} />
            <Link to="/quiz">
              <button className="ml-2 mr-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-5 py-2 rounded-full font-medium shadow-md shadow-pink-500/25 hover:from-pink-600 hover:to-rose-600 hover:shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]">
                Know Your Skin
              </button>
            </Link>

            {userData ? (
              <ProfileDropdown userData={userData} handleLogout={handleLogout} />
            ) : (
              <button
                onClick={handleUserClick}
                className="ml-2 p-2.5 text-gray-700 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors duration-200"
                aria-label="Login or signup"
              >
                <FaRegUser className="text-lg" />
              </button>
            )}

            <Link to="/wishlist" aria-label="Wishlist">
              <div className="relative p-2 rounded-full hover:bg-rose-50 transition-colors duration-200">
                <FiHeart className="text-2xl text-gray-700" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                    {wishlist.length > 99 ? '99+' : wishlist.length}
                  </span>
                )}
              </div>
            </Link>

            <Link to="/cart" aria-label="Cart">
              <div className="relative p-2 rounded-full hover:bg-emerald-50 transition-colors duration-200">
                <FiShoppingCart className="text-2xl text-gray-700" />
                {products.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                    {products.length > 99 ? '99+' : products.length}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Mobile: cart + menu toggle */}
          <div className="lg:hidden flex items-center gap-1">
            <Link to="/cart" aria-label="Cart" className="relative p-2 rounded-full hover:bg-emerald-50 transition-colors duration-200">
              <FiShoppingCart className="text-xl text-gray-700" />
              {products.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center shadow">
                  {products.length > 99 ? '99+' : products.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-emerald-50 rounded-full transition-colors duration-200" aria-label="Toggle menu">
              {isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
     {isOpen && (
  <MobileMenu
    navLinks={navLinks}
    categories={categories}
    isLoggedIn={!!userData}
    handleLogout={handleLogout}
    handleUserClick={handleUserClick}
    cartCount={products.length}
    handleClose={() => setIsOpen(false)} // <-- pass close function
  />
)}


    </nav>

    {/* Mobile menu backdrop — outside nav so `fixed` covers the viewport */}
    {isOpen && (
      <div
        className="lg:hidden fixed inset-0 bg-black/30 z-40"
        onClick={() => setIsOpen(false)}
      />
    )}

    {/* Auth Modal — outside nav: backdrop-filter on nav would trap fixed positioning */}
    {isFormOpen && (
      <AuthModal
        isLoginForm={isLoginForm}
        formData={formData}
        handleInputChange={handleInputChange}
        handleFormToggle={handleFormToggle}
        handleSubmit={handleSubmit}
        handleUserClick={handleUserClick}
      />
    )}

    <ToastContainer />
    </>
  );
};

export default Navbar;
