import { MdArrowForwardIos } from "react-icons/md";

export default function SectionControls({ onPrev, onNext, canPrev, canNext }) {
  return (
    <>
      {canPrev && (
        <button
          onClick={onPrev}
          aria-label="Sebelumnya"
          className="absolute left-3 top-24 md:top-36 z-30 flex items-center justify-center
          w-9 md:w-12 h-9 md:h-12 -translate-y-1/2 transition-all duration-200
          rounded-full cursor-pointer
          bg-black/40 hover:bg-black/70
          hover:scale-110 active:scale-95
          backdrop-blur-sm border border-white/10 text-white"
        >
          <MdArrowForwardIos className="rotate-180"/>
        </button>
      )}

      {canNext && (
        <button
          onClick={onNext}
          aria-label="Berikutnya"
          className="absolute right-3 top-24 md:top-36 z-30 flex items-center justify-center
           w-9 md:w-12 h-9 md:h-12 -translate-y-1/2 transition-all duration-200
          rounded-full cursor-pointer
          bg-black/40 hover:bg-black/70
          hover:scale-110 active:scale-95
          backdrop-blur-sm border border-white/10 text-white"
        >
          <MdArrowForwardIos/>
        </button>
      )}
    </>
  );
}
