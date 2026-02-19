import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// MainLayout.jsx
export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(null); // ← null dulu

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();           // panggil sekali
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ← Tambahkan pengecekan ini
  if (isSidebarOpen === null) {
    return (
      <div className="min-h-screen font-sans">
        <Navbar onMenuClick={() => {}} /> {/* dummy */}
        {/* Jangan render Sidebar & main dulu */}
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <Sidebar isOpen={isSidebarOpen} />

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

      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </div>
  );
}