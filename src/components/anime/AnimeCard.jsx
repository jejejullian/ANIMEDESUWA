import { useNavigate } from "react-router-dom"

export default function AnimeCard({ anime }) {
    const navigate = useNavigate()
  return (
    <div onClick={()=>navigate(`/anime/${anime.mal}`)} className="bg-surface-1 rounded-lg overflow-hidden shadow hover:shadow-lg hover:scale-105 transition-all cursor-pointer flex flex-col h-full">
      
      <img 
        src={anime.images.jpg.image_url} 
        alt={anime.title}
        className="w-full h-40 md:h-48 lg:h-56 object-cover"
      />

      <div className="p-3 flex flex-col flex-1">
        
        <h3 className="font-bold text-foreground text-sm line-clamp-2 mb-2 min-h-10">
          {anime.title}
        </h3>

        <div className="mt-auto flex items-center justify-between text-xs">
          <span className="text-brand">⭐ {anime.score || 'N/A'}</span>
          <span className="text-foreground-muted">{anime.type}</span>
        </div>

      </div>
    </div>
  )
}
