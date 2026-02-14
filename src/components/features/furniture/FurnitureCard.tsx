"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Furniture } from "@/types/furniture";

interface FurnitureCardProps {
  furniture: Furniture;
  priorityImage?: boolean;
}

export function FurnitureCard({
  furniture,
  priorityImage = false,
}: FurnitureCardProps) {
  return (
    <Link href={`/furniture/${furniture.id}`} className="block">
      <div className="block group relative overflow-hidden">
        <div className="aspect-4/3 transform group-hover:-translate-y-8 transition-transform duration-700 ease-natural">
          {furniture.image_url ? (
            <Image
              src={furniture.image_url}
              alt={furniture.name}
              width={400}
              height={300}
              loading={priorityImage ? "eager" : "lazy"}
              priority={priorityImage}
              className="size-full object-cover"
              unoptimized
            />
          ) : (
            <div className="size-full flex items-center justify-center text-kuralis-400 bg-kuralis-50">
              No image
            </div>
          )}
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-white px-3 py-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-natural">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold tracking-tighter-custom">
              {furniture.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
