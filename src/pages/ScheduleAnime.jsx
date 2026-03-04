import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useScheduleAnime from "@hooks/useScheduleAnime";
import GridSkeleton from "@components/ui/GridSkeleton";
import AnimeCard from "@components/anime/AnimeCard";

// === Nama hari Indonesia ===
const DAYS = [
  { en: "monday", id: "Senin" },
  { en: "tuesday", id: "Selasa" },
  { en: "wednesday", id: "Rabu" },
  { en: "thursday", id: "Kamis" },
  { en: "friday", id: "Jumat" },
  { en: "saturday", id: "Sabtu" },
  { en: "sunday", id: "Minggu" },
];

export default function ScheduleAnime() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getTodayDay = () => {
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    return dayNames[new Date().getDay()];
  };

  const dayFromUrl = searchParams.get("day");
  let day = DAYS.some((d) => d.en === dayFromUrl) ? dayFromUrl : getTodayDay();

  useEffect(() => {
    if (!dayFromUrl || !DAYS.some((d) => d.en === dayFromUrl)) {
      setSearchParams({ day: getTodayDay() }, { replace: true });
    }
  }, [dayFromUrl, setSearchParams]);

  const { data, isLoading, error, isFetching } = useScheduleAnime(day, 24);

  const animes = data?.data || [];

  const handleDayChange = (newDay) => {
    setSearchParams({ day: newDay });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500 text-lg">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 tracking-widest">Schedule Anime</h1>
      </div>

      {/* Day Badges */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4 mb-8">
        {DAYS.map(({ en, id }) => {
          const isToday = en === getTodayDay();
          const displayText = isToday ? "HARI INI" : id;

          return (
            <button
              key={en}
              onClick={() => handleDayChange(en)}
              className={`px-3 sm:px-4 py-2 rounded-full text-[10px] sm:text-xs font-semibold uppercase transition cursor-pointer whitespace-nowrap flex items-center justify-center
                ${day === en ? "bg-brand text-white shadow-lg" : "bg-surface-2 text-gray-300 hover:bg-surface-3"}
              `}
            >
              {displayText}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading && !data ? (
        <GridSkeleton count={24} />
      ) : (
        <>
          {animes.length === 0 ? (
            <div className="text-center py-16 text-gray-400">Tidak ada anime untuk hari ini</div>
          ) : (
            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-fr ${isFetching ? "opacity-50" : "opacity-100"}`}>
              {animes.map((anime) => (
                <AnimeCard key={anime.mal_id} anime={anime}>
                  <span className="absolute top-2 left-2 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded">
                    {day === getTodayDay() 
                      ? "HARI INI" 
                      : DAYS.find((d) => d.en === day)?.id.toUpperCase()}
                  </span>
                </AnimeCard>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}