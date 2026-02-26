import HeroCarousel from "@components/anime/hero/HeroCarousel";
import SectionCarousel from "@components/anime/section/SectionCarousel";

import useSeasonNow from "@hooks/useSeasonNow";
import useCurrentSeasonLatestEpisodes from "@hooks/useCurrentSeasonLatestEpisodes";
import useTopAnime from "@hooks/useTopAnime";
import useTopMovieAiring from "@hooks/useTopMovieAiring";

export default function Home() {
  const { data: seasonAnimes = [], isLoading: seasonLoading } = useSeasonNow(12);

  const { data: latestAnimes = [], isLoading: latestLoading } = useCurrentSeasonLatestEpisodes(8);

  const {data: topAnime = [], isLoading: topLoading} = useTopAnime(15)

  const {data: topMovie = [], isLoading: topMovieLoading} = useTopMovieAiring(15)

  return (
    <div className="p-4 sm:p-6">
      <HeroCarousel />

      <SectionCarousel title="Season Now" animes={seasonAnimes} loading={seasonLoading} />

      <SectionCarousel title="Latest Episodes" animes={latestAnimes} loading={latestLoading} />

      <SectionCarousel title="Top Anime" animes={topAnime} loading={topLoading} />

      <SectionCarousel title="Top Movie" animes={topMovie} loading={topMovieLoading} />

    </div>
  );
}
