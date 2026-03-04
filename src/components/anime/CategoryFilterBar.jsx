import Select from "@components/ui/Select";

export default function CategoryFilterBar({ 
  filters, 
  update, 
  setFilters, 
  genresData, 
  hasActiveFilters 
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-surface-1 p-4 rounded-xl border border-outline">
      <Select label="Genre" value={filters.genre} onChange={update("genre")}>
        <option value="">Semua</option>
        {genresData?.map((genre) => (
          <option key={genre.mal_id} value={genre.mal_id}>
            {genre.name}
          </option>
        ))}
      </Select>

      <Select label="Status" value={filters.status} onChange={update("status")}>
        <option value="">Semua</option>
        <option value="airing">Airing</option>
        <option value="complete">Finished</option>
        <option value="upcoming">Upcoming</option>
      </Select>

      <Select label="Type" value={filters.type} onChange={update("type")}>
        <option value="">Semua</option>
        <option value="tv">TV</option>
        <option value="movie">Movie</option>
        <option value="ova">OVA</option>
        <option value="special">Special</option>
        <option value="ona">ONA</option>
      </Select>

      <Select label="Order By" value={filters.orderBy} onChange={update("orderBy")}>
        <option value="rating">Rating</option>
        <option value="popular">Populer</option>
        <option value="az">A → Z</option>
        <option value="za">Z → A</option>
        <option value="updated">Update Terbaru</option>
      </Select>

      <button
        onClick={() =>
          setFilters({ genre: "", status: "", type: "", orderBy: "rating", page: 1 })
        }
        disabled={!hasActiveFilters}
        className={`self-end py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 border ${
          hasActiveFilters
            ? "bg-surface-2 border-outline text-white hover:bg-surface-3 hover:text-brand cursor-pointer shadow-sm"
            : "bg-surface-1 border-outline/30 text-foreground-muted opacity-50 cursor-not-allowed"
        }`}
      >
        ✕ Reset
      </button>
    </div>
  );
}