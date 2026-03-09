import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "@pages/Login";
import Register from "@pages/Register";

import Profile from "@pages/Profile";
import Watchlist from "./pages/Watchlist";

import MainLayout from "./components/layout/MainLayout";

import Home from "./pages/Home";
import AnimeDetail from "@pages/AnimeDetail";
import Trending from "@pages/Trending";
import UpcomingAnime from "@pages/UpcomingAnime";
import TopAnime from "@pages/TopAnime";
import TopMovie from "@pages/Topmovie";
import SeasonNow from "@pages/SeasonNow";
import CategoryAnime from "@pages/CategoryAnime";
import ScheduleAnime from "@pages/ScheduleAnime";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#242d33",
            color: "#fff",
            border: "1px solid #313c44",
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/watchlist" element={<Watchlist />} />

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
          path="/category"
          element={
            <MainLayout>
              <CategoryAnime />
            </MainLayout>
          }
        />

        <Route
          path="/schedule"
          element={
            <MainLayout>
              <ScheduleAnime />
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
