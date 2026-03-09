import { useState, useRef, useEffect } from "react";
import { FaSearch, FaBars, FaArrowLeft, FaUser, FaBookmark, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import toast from "react-hot-toast";

export default function Navbar({ onMenuClick }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
    toast.success("Berhasil Logout!"); 
    navigate("/");
  };

  return (
    <header className="bg-surface-2 shadow-sm h-16 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4">
      <nav className={`flex items-center gap-4 w-full justify-between ${isSearchOpen ? "hidden md:flex" : "flex"}`}>
        {/* Hamburger + Logo */}
        <div className="flex items-center gap-4 ">
          <button onClick={onMenuClick} className="text-foreground hover:text-brand-light transition cursor-pointer">
            <FaBars size={24} />
          </button>

          <Link to="/" className="font-logo text-2xl font-bold text-brand absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            Anime<span className="text-brand-light">Desuwa</span>
          </Link>
        </div>

        {/* Search Bar (Hanya Muncul di LAPTOP) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input type="text" placeholder="Cari anime..." className="w-full bg-surface-1 border border-outline text-foreground rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-dark transition" />
          <FaSearch className="absolute right-4 top-3 text-foreground-muted" />
        </div>

        {/* Icon Search (HP) & User Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setIsSearchOpen(true)} className="md:hidden text-foreground p-2 rounded-full cursor-pointer">
            <FaSearch size={20} />
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Tombol Avatar User */}
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-surface-3 border-2 border-brand/50 hover:border-brand transition overflow-hidden cursor-pointer"
              >
                <FaUser className="text-foreground-muted text-sm" />
              </button>

              {/* Menu Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-surface-1 border border-outline rounded-xl shadow-2xl py-2 z-50 animate-fadeSlideUp">
                  {/* Info Header */}
                  <div className="px-4 py-3 border-b border-outline mb-2">
                    <p className="text-sm font-bold text-white truncate">
                      {user.user_metadata?.username || "Anime Fans"}
                    </p>
                    <p className="text-xs text-foreground-muted truncate mt-0.5">
                      {user.email}
                    </p>
                  </div>
                  
                  {/* Link Menu */}
                  <Link 
                    to="/profile" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface-2 transition"
                  >
                    <FaUserCircle className="text-brand text-lg" /> Profil Saya
                  </Link>
                  <Link 
                    to="/watchlist" 
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface-2 transition"
                  >
                    <FaBookmark className="text-brand text-lg" /> Watchlist
                  </Link>
                  
                  <div className="h-px bg-outline my-2"></div>
                  
                  {/* Tombol Logout */}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-surface-2 hover:text-red-300 transition cursor-pointer"
                  >
                    <FaSignOutAlt className="text-lg" /> Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Tombol Login Default (Kalau belum login) */
            <Link to="/login" className="hidden md:block bg-brand text-white font-bold px-6 py-2 rounded-full text-sm hover:bg-brand-dark transition shadow-lg">
              Masuk
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile search overlay */}
      <div
        className={`
            absolute top-0 left-0 right-0 h-16 bg-surface-2 border-b border-outline z-50 px-4 flex items-center gap-2 
            transition-transform duration-300 ease-in-out md:hidden
            ${isSearchOpen ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        <button onClick={() => setIsSearchOpen(false)} className="text-foreground p-2 cursor-pointer">
          <FaArrowLeft size={20} />
        </button>

        <div className="flex-1 relative">
          <input type="text" placeholder="Mau nonton apa..." className="w-full bg-surface-1 border border-outline text-white rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand" autoFocus />
          <FaSearch className="absolute right-4 top-3 text-foreground-muted" />
        </div>
      </div>
    </header>
  );
}