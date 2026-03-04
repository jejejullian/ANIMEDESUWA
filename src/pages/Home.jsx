import HeroCarousel from "@components/anime/hero/HeroCarousel";
import SectionCarousel from "@components/anime/section/SectionCarousel";


import useSeasonNow from "@hooks/useSeasonNow";
import useTopAnime from "@hooks/useTopAnime";
import useTopMovieAiring from "@hooks/useTopMovie";
import useUpcomingAnime from "@hooks/useUpcomingAnime";

export default function Home() {
  const { data: seasonData, isLoading: seasonLoading } = useSeasonNow(1, 12);

  const {data: upcomingData, isLoading: upcomingLoading} = useUpcomingAnime(1, 15)

  const { data: topData, isLoading: topLoading } = useTopAnime(1, 15);

  const { data: movieData, isLoading: movieLoading } = useTopMovieAiring(1, 15);

  return (
    <div className="p-4 sm:p-6">
      <HeroCarousel />

      <SectionCarousel title="Season Now" animes={seasonData?.data || []} loading={seasonLoading} seeAllLink="/season-now" />

      <SectionCarousel title="Upcoming" animes={upcomingData?.data || []} loading={upcomingLoading} seeAllLink="/upcoming-anime" />

      <SectionCarousel title="Top Anime" animes={topData?.data || []} loading={topLoading} seeAllLink="/top-anime" />

      <SectionCarousel title="Top Movie" animes={movieData?.data || []} loading={movieLoading} seeAllLink="/top-movie" />
    </div>
  );
}
