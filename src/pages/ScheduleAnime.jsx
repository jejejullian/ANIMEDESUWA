import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useScheduleAnime from "@hooks/useScheduleAnime";
import AnimeCard from "@components/anime/AnimeCard";
import GridSkeleton from "@components/ui/GridSkeleton";

import AnimeGrid from "@components/anime/AnimeGrid";
import StateMessage from "@components/ui/StateMessage";

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

  if (error) return <StateMessage type="error" message={error.message} />;

  return (
    <div className="p-4 sm:p-6">
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

      {isLoading && !data ? (
        <GridSkeleton count={24} />
      ) : animes.length === 0 ? (
        <StateMessage message={`Tidak ada anime yang dijadwalkan untuk hari ${DAYS.find((d) => d.en === day)?.id}.`} />
      ) : (
        <AnimeGrid isFetching={isFetching}>
          {animes.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime}>
              <span className="absolute top-2 left-2 bg-brand text-white text-[10px] font-bold px-2 py-1 rounded">{day === getTodayDay() ? "HARI INI" : DAYS.find((d) => d.en === day)?.id.toUpperCase()}</span>
            </AnimeCard>
          ))}
        </AnimeGrid>
      )}
    </div>
  );
}
