import { Link, useLocation } from "react-router-dom";
import { FaHome, FaFire, FaThLarge, FaCalendarAlt, FaSignInAlt } from "react-icons/fa"; // Tambah FaSignInAlt

const sidebarMenu = [
  { name: "Home", path: "/", icon: <FaHome /> },
  { name: "Trending", path: "/trending", icon: <FaFire /> },
  { name: "Kategori", path: "/category", icon: <FaThLarge /> },
  { name: "Jadwal", path: "/schedule", icon: <FaCalendarAlt /> },
];

export default function Sidebar({ isOpen }) {
  const location = useLocation();

  return (
    <aside 
      className={`
        fixed left-0 top-16 bottom-0 z-40 w-64 bg-surface-1 border-r border-outline shadow-lg flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Menu Utama */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {sidebarMenu.map((item, index) => (
            <li key={index}>
              <Link 
                to={item.path} 
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  location.pathname === item.path 
                    ? "text-foreground bg-brand-dark border-r-4 border-brand-dark" 
                    : "text-foreground-muted hover:bg-brand-dark/60 hover:text-foreground"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* --- BAGIAN LOGIN (KHUSUS MOBILE) --- */}
      {/* Kita taruh di bawah Sidebar */}
      <div className="p-4 md:hidden">
        <Link 
          to="/login"
          className="flex items-center justify-center gap-2 w-full bg-brand text-foreground py-2 rounded-lg font-bold shadow hover:bg-brand-dark transition"
        >
          <FaSignInAlt /> Masuk Akun
        </Link>
      </div>

    </aside>
  );
}