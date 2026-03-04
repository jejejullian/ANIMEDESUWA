import { useNavigate } from "react-router-dom";

export default function AnimeCard({ anime, children }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/anime/${anime.mal_id}`)} className="cursor-pointer group flex flex-col h-full">
      <div className="relative rounded-xl overflow-hidden shadow-2xl">
        <img src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url} alt={anime.title} className="w-full aspect-2/3 object-cover transition-transform duration-300 group-hover:scale-105" />

        {/* Badge Custom */}
        {children}

        {/* Year Badge */}
        {(anime.year || anime.aired?.from) && <span className="absolute bottom-2 left-2 bg-surface-2/80 text-foreground text-[10px] px-2 py-0.5 rounded-sm">{anime.year ?? new Date(anime.aired.from).getFullYear()}</span>}

        {/* Score Badge */}
        {anime.score && <span className="absolute bottom-2 right-2 bg-brand text-foreground text-[10px] font-bold px-1 py-0.5 rounded tracking-widest">★ {anime.score}</span>}
      </div>

      <p className="text-white text-xs md:text-sm font-medium mt-3 text-center line-clamp-2 uppercase">{anime.title}</p>
    </div>
  );
}
