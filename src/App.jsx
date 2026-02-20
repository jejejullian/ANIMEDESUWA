import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Home from "./pages/Home";
import Trending from "@pages/Trending";
import AnimeDetail from "@pages/AnimeDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/trending"
          element={
            <MainLayout>
              <Trending />
            </MainLayout>
          }
        />

        <Route
          path="/anime/:id"
          element={
            <MainLayout>
              <AnimeDetail />
            </MainLayout>
          }
        />

        <Route
          path="/login"
          element={
            <div className="flex h-screen items-center justify-center bg-gray-200">
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
