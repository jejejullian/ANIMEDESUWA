import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({ children }) {
  // State: Default Terbuka di Laptop, Tertutup di HP
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Logic: Cek ukuran layar saat pertama kali load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false); // HP default tutup
      } else {
        setIsSidebarOpen(true);  // Laptop default buka
      }
    };

    // Jalankan saat pertama load
    handleResize();

    // Dengarkan perubahan ukuran layar
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen font-sans">
      
      {/* 1. Navbar (Fixed di Atas) */}
      {/* Kirim fungsi toggle biar tombol hamburger jalan */}
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* 2. Sidebar (Fixed di Kiri Bawah Navbar) */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* 3. Konten Utama */}
      {/* pt-16: Supaya tidak ketutup Navbar */}
      {/* ml-0 / ml-64: Supaya konten minggir kalau sidebar buka (khusus mode Desktop) */}
      <main 
        className={`
          pt-16 p-6 transition-all duration-300 
          ${isSidebarOpen ? "md:ml-64" : "ml-0"}
        `}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay Gelap (Khusus HP saat Sidebar Buka) */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
}