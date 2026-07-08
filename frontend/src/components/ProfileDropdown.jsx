import { Link } from "react-router-dom";
import { Package, Heart, LogOut, LayoutDashboard } from "lucide-react";

const ProfileDropdown = ({ userData, handleLogout }) => (
  <div className="relative group">
    <div className="avatar cursor-pointer">
      <div className="w-8 h-8 rounded-full ring-2 ring-emerald-200 hover:ring-emerald-400 transition-all">
        <img
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          alt="profile"
        />
      </div>
    </div>

    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/60">
        <p className="text-sm font-semibold text-gray-900">{userData?.name}</p>
        <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
      </div>
      <div className="py-1">
        {userData?.role === "admin" && (
          <Link
            to="/admin"
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 transition-colors"
          >
            <LayoutDashboard size={15} />
            Admin Panel
          </Link>
        )}
        <Link
          to="/myorders"
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
        >
          <Package size={15} />
          My Orders
        </Link>
        <Link
          to="/wishlist"
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
        >
          <Heart size={15} />
          My Wishlist
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 border-t border-gray-100 transition-colors"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  </div>
);

export default ProfileDropdown;
