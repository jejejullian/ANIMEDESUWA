import { useState } from "react";
import { FaSearch, FaBars, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-surface-2 shadow-sm h-16 fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4">
      <div className={`flex items-center gap-4 w-full justify-between ${isSearchOpen ? "hidden md:flex" : "flex"}`}>
        {/* KIRI: Hamburger + Logo */}
        <div className="flex items-center gap-4 ">
          <button onClick={onMenuClick} className="text-foreground hover:text-brand-light transition">
            <FaBars size={24} />
          </button>

          <Link to="/" className="font-logo text-2xl font-bold text-brand absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            Anime<span className="text-brand-light">Desuwa</span>
          </Link>
        </div>

        {/* Search Bar (Hanya Muncul di LAPTOP) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input type="text" placeholder="Cari anime..." className="w-full bg-foreground text-foreground-inverse rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-dark transition" />
          <FaSearch className="absolute right-3 top-3 text-foreground-inverse" />
        </div>

        {/* Icon Search (HP)*/}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSearchOpen(true)} className="md:hidden text-foreground p-2rounded-full">
            <FaSearch size={20} />
          </button>

          {/* Tombol Login (Hanya Muncul di LAPTOP) */}
          <Link to="/login" className="hidden md:block bg-brand text-foreground px-5 py-2 rounded-full text-sm hover:bg-brand-dark transition">
            Masuk
          </Link>
        </div>
      </div>

    {/* Mobile search overlay (hidden on md+) */}
      <div
        className={`
            absolute top-0 left-0 right-0 h-16 bg-surface-1 z-50 px-4 flex items-center gap-2 
            transition-transform duration-300 ease-in-out md:hidden
            ${isSearchOpen ? "translate-y-0" : "-translate-y-full"}
        `}
      >
        {/* Tombol Back / Close */}
        <button onClick={() => setIsSearchOpen(false)} className="text-foreground p-2">
          <FaArrowLeft size={20} />
        </button>

        {/* Input Search Mobile */}
        <div className="flex-1 relative">
          <input type="text" placeholder="Mau nonton apa..." className="w-full bg-foreground text-foreground-inverse rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-foreground-muted" autoFocus />
          <FaSearch className="absolute right-3 top-3 text-foreground-muted" />
        </div>
      </div>
    </header>
  );
}
