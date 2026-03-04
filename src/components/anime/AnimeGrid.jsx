export default function AnimeGrid({ children, isFetching = false }) {
  return (
    <div 
      className={`
        grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-fr 
        transition-opacity duration-300 
        ${isFetching ? "opacity-50 pointer-events-none" : "opacity-100"}
      `}
    >
      {children}
    </div>
  );
}