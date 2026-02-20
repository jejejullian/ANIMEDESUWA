import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

// MainLayout.jsx
export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(null); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();           
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isSidebarOpen === null) {
    return (
      <div className="min-h-screen font-sans">
        <Navbar onMenuClick={() => {}} /> 
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <Sidebar isOpen={isSidebarOpen} />

      <main 
        className={`
          pt-16 p-6 transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? "lg:ml-64" : "ml-0"}
        `}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </div>
  );
}