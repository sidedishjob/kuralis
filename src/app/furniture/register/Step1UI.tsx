"use client";

import { useFurnitureMeta } from "@/hooks/useFurnitureMeta";
import { FiArrowRight } from "react-icons/fi";
import { ErrorMessage } from "@/components/common/ui/ErrorMessage";
import { Button } from "@/components/ui/button";
import type { Category, Location } from "@/types/furniture_meta";

interface Props {
  category: Category | null;
  location: Location | null;
  setCategory: (category: Category) => void;
  setLocation: (location: Location) => void;
  onNext: () => void;
}

export default function Step1UI({
  category,
  location,
  setCategory,
  setLocation,
  onNext,
}: Props) {
  const isValid = !!category && !!location;
  const { data, isLoading, error } = useFurnitureMeta();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-kuralis-100 rounded-sm" />
        <div className="h-6 w-1/3 bg-kuralis-100 rounded-sm" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-kuralis-100 rounded-sm" />
          ))}
        </div>
        <div className="h-6 w-1/3 bg-kuralis-100 rounded-sm" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 bg-kuralis-100 rounded-sm" />
          ))}
        </div>
        <div className="pt-6">
          <div className="h-10 bg-kuralis-100 rounded-sm" />
        </div>
      </div>
    );
  }

  if (error)
    return <ErrorMessage error={error} className="mx-auto mt-10 max-w-md" />;

  return (
    <div className="space-y-4 md:space-y-8">
      <h1 className="text-xl md:text-3xl font-bold tracking-tighter-custom text-center mb-6 text-kuralis-900">
        カテゴリと設置場所を選んでください
      </h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-4">
            カテゴリ
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data?.categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c)}
                className={`py-3 px-4 border rounded-sm transition-all duration-500 font-bold tracking-tighter-custom text-sm relative overflow-hidden group ${
                  category?.id === c.id
                    ? "border-kuralis-900 text-kuralis-900 bg-kuralis-100"
                    : "border-kuralis-200 text-kuralis-600 hover:border-kuralis-400 hover:bg-kuralis-50"
                }`}
              >
                <span
                  className={`absolute inset-0 bg-kuralis-100 transform origin-left transition-transform duration-500 ${
                    category?.id === c.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                <span className="relative z-10">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold tracking-tighter-custom text-kuralis-600 mb-6">
            設置場所
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data?.locations.map((l) => (
              <button
                key={l.id}
                onClick={() => setLocation(l)}
                className={`py-3 px-4 border rounded-sm transition-all duration-500 font-bold tracking-tighter-custom text-sm relative overflow-hidden group ${
                  location?.id === l.id
                    ? "border-kuralis-900 text-kuralis-900 bg-kuralis-100"
                    : "border-kuralis-200 text-kuralis-600 hover:border-kuralis-400 hover:bg-kuralis-50"
                }`}
              >
                <span
                  className={`absolute inset-0 bg-kuralis-100 transform origin-left transition-transform duration-500 ${
                    location?.id === l.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
                <span className="relative z-10">{l.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-6">
        <Button
          onClick={onNext}
          disabled={!isValid}
          className={`w-full tracking-tighter-custom transition-all duration-300 ${
            isValid
              ? "bg-kuralis-900 text-white hover:bg-kuralis-800"
              : "bg-kuralis-200 text-kuralis-400 cursor-not-allowed"
          }`}
        >
          <span>次へ</span>
          <FiArrowRight
            size={16}
            className="transform group-hover:translate-x-1 transition-transform duration-300"
          />
        </Button>
      </div>
    </div>
  );
}
