import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import useTopAiring from "@hooks/useTopAiring"; 

import HeroSkeleton from "./HeroSkeleton";
import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import CarouselControls from "./HeroControls";

export default function HeroCarousel() {
  const { data: animes = [], isLoading: loading, error } = useTopAiring(8); 

  const [current, setCurrent] = useState(0);

  const currentRef = useRef(0);
  const animesRef = useRef([]);
  const intervalRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    animesRef.current = animes;
  }, [animes]);

  const goTo = useCallback((index) => {
    if (isAnimatingRef.current) return;
    if (index === currentRef.current) return;

    isAnimatingRef.current = true;
    currentRef.current = index;
    setCurrent(index);

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 600);
  }, []);

  const goNext = useCallback(() => {
    const total = animesRef.current.length;
    if (total === 0) return;
    const next = (currentRef.current + 1) % total;
    goTo(next);
  }, [goTo]);

  const goPrev = useCallback(() => {
    const total = animesRef.current.length;
    if (total === 0) return;
    const prev = (currentRef.current - 1 + total) % total;
    goTo(prev);
  }, [goTo]);

  const startInterval = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(goNext, 5000);
  }, [goNext]);

  useEffect(() => {
    if (animes.length === 0) return;
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [animes.length, startInterval]);

  const handleNavigate = () => {
    const anime = animesRef.current[currentRef.current];
    if (anime?.mal_id) {
      navigate(`/anime/${anime.mal_id}`);
    }
  };

  if (loading) return <HeroSkeleton />;
  if (error || animes.length === 0) {
    console.warn("HeroCarousel error or no data:", error);
    return null; 
  }

  const anime = animes[current];

  return (
    <div className="relative w-full overflow-hidden rounded-xl select-none aspect-2/3 sm:aspect-video md:aspect-16/6 min-h-105 sm:min-h-80 max-h-170 md:max-h-130">
      <HeroBackground animes={animes} current={current} />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-1 bg-linear-to-r from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-0 z-1 bg-linear-to-t from-black/75 to-transparent" />

      <HeroContent anime={anime} current={current} handleNavigate={handleNavigate} />

      <CarouselControls
        current={current}
        total={animes.length}
        onPrev={() => {
          goPrev();
          startInterval();
        }}
        onNext={() => {
          goNext();
          startInterval();
        }}
        onDotClick={(i) => {
          goTo(i);
          startInterval();
        }}
      />
    </div>
  );
}