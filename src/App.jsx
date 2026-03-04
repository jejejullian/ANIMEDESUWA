import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Home from "./pages/Home";
import AnimeDetail from "@pages/AnimeDetail";
import Trending from "@pages/Trending";
import UpcomingAnime from "@pages/UpcomingAnime";
import TopAnime from "@pages/TopAnime";
import TopMovie from "@pages/Topmovie";
import SeasonNow from "@pages/SeasonNow";

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
          path="/upcoming-anime"
          element={
            <MainLayout>
              <UpcomingAnime />
            </MainLayout>
          }
        />

        <Route
          path="/top-anime"
          element={
            <MainLayout>
              <TopAnime />
            </MainLayout>
          }
        />
        <Route
          path="/top-movie"
          element={
            <MainLayout>
              <TopMovie />
            </MainLayout>
          }
        />
        <Route
          path="/season-now"
          element={
            <MainLayout>
              <SeasonNow />
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

        <Route path="/login" element={<div className="flex h-screen items-center justify-center bg-gray-200"></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
