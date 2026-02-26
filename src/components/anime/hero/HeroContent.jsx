import { FaPlay } from "react-icons/fa";

export default function HeroContent({ anime, current, handleNavigate }) {
  const genres = anime.genres?.slice(0, 3).map((g) => g.name) || [];
  const score = anime.score ? anime.score.toFixed(1) : null;

  return (
    <div key={`content-${current}`} className="absolute inset-0 z-2 flex flex-col justify-end p-5 sm:p-8 md:p-12 mx-4 animate-fadeSlideUp">
      {/* Badge rank + score */}
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2.5 py-0.5 text-xs font-bold text-foreground rounded bg-brand">#{current + 1} Top Airing</span>
        {score && <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-brand-light rounded backdrop-blur-sm bg-foreground-inverse/50">★ {score}</span>}
      </div>

      {/* Judul */}
      <h2 className="mb-2 font-extrabold leading-tight text-foreground text-xl md:text-3xl text-shadow-lg/20 max-w-full md:max-w-2/3">{anime.title_english || anime.title}</h2>

      {/* Genre tags */}
      {genres.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {genres.map((g) => (
            <span key={g} className="px-2 py-0.5 text-xs rounded-full border-foreground-inverse-muted text-foreground bg-foreground-inverse/50 backdrop-blur-sm">
              {g}
            </span>
          ))}
        </div>
      )}

      {/* Sinopsis */}
      {anime.synopsis && (
        <p
          className="hidden mb-4 text-sm leading-relaxed text-foreground 
           max-w-full md:max-w-2/3 overflow-hidden 
           line-clamp-1 sm:line-clamp-2"
        >
          {anime.synopsis}
        </p>
      )}

      {/* Tombol CTA */}
      <div className="flex gap-3 mb-4 md:mb-0">
        <button
          onClick={handleNavigate}
          className="inline-flex items-center justify-center gap-2 px-3 md:px-5 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 rounded-full cursor-pointer bg-brand hover:bg-brand-dark hover:scale-105 active:scale-95 flex-1 md:flex-none"
        >
          <FaPlay className="w-2" />
          Tonton Sekarang
        </button>

        {/* Tombol Info  */}
        <button
          onClick={handleNavigate}
          className="hidden md:inline-flex items-center gap-2 px-2 md:px-5 py-2.5 text-sm font-semibold text-foreground transition-all duration-200 rounded-full border border-foreground-inverse-muted/40 hover:border-foreground-inverse-muted/70 bg-foreground-inverse/50 hover:bg-foreground/10 active:scale-95 backdrop-blur-sm cursor-pointer"
        >
          Info Lengkap
        </button>
      </div>
    </div>
  );
}
