import { BrowserRouter, Routes, Route } from "react-router-dom";

// CUKUP Import Layout Utamanya saja (Mandornya)
// Tidak perlu import Sidebar/Navbar di sini
import MainLayout from "./components/layout/MainLayout"; 

// Import Halaman
import Home from "./pages/Home";
import Trending from "@pages/Trending";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- ROUTE 1: Halaman dengan Sidebar & Navbar --- */}
        <Route 
          path="/" 
          element={
            // Home dibungkus MainLayout
            // Otomatis dapat Sidebar & Navbar gratis!
            <MainLayout>
              <Home />
            </MainLayout>
          } 
        />

        {/* Contoh halaman lain (misal Trending) */}
        <Route 
          path="/trending" 
          element={
            <MainLayout>
              <Trending/>
            </MainLayout>
          } 
        />


        {/* --- ROUTE 2: Halaman Login (TANPA Sidebar) --- */}
        {/* Perhatikan: Tidak pakai <MainLayout> di sini */}
        <Route 
          path="/login" 
          element={
            <div className="flex h-screen items-center justify-center bg-gray-200">
              <h1>Halaman Login (Full Screen)</h1>
            </div>
          } 
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;