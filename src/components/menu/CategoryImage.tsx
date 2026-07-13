"use client";

import Image from "next/image";
import { useState } from "react";

interface CategoryImageProps {
  imageUrl: string | null | undefined;
  label: string;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

const SIZE_MAP: Record<NonNullable<CategoryImageProps['size']>, number> = {
  sm: 28,
  md: 56,
  lg: 64,
};

export function CategoryImage({ imageUrl, label, size = 'md', rounded = true }: CategoryImageProps) {
  const [failed, setFailed] = useState(false);
  const dimension = SIZE_MAP[size];
  const radius = rounded ? '9999px' : '8px';

  if (!imageUrl || failed) {
    return null;
  }

  return (
    <div
      style={{
        position: 'relative',
        width: `${dimension}px`,
        height: `${dimension}px`,
        borderRadius: radius,
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <Image
        src={imageUrl}
        alt={label}
        fill
        sizes={`${dimension}px`}
        className="object-cover"
        unoptimized
        onError={() => setFailed(true)}
      />
    </div>
  );
}
