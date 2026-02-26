export default function HeroBackground({ animes, current }) {
  return (
    <>
      {animes.map((a, i) => {
        const img = a.images?.jpg?.large_image_url || a.images?.jpg?.image_url;
        return (
          <div key={a.mal_id} className="absolute inset-0 transition-opacity duration-700" style={{ opacity: i === current ? 1 : 0, zIndex: 0 }}>
            <img src={img} alt={a.title} className="object-cover object-center w-full h-full" loading={i === 0 ? "eager" : "lazy"} />
          </div>
        );
      })}
    </>
  );
}
