export default function StateMessage({ type = "empty", message }) {
  const isError = type === "error";
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center min-h-[50vh]">
      <div className={`text-5xl mb-4 ${isError ? "text-red-500/50" : "text-foreground-muted/50"}`}>
        {isError ? "⚠️" : "📭"}
      </div>
      <p className={`text-lg md:text-xl font-medium ${isError ? "text-red-400" : "text-foreground-muted"}`}>
        {message || (isError ? "Terjadi kesalahan." : "Tidak ada data ditemukan.")}
      </p>
    </div>
  );
}