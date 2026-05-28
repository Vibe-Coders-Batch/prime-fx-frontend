"use client";

import Image, { type ImageProps } from "next/image";
import { TEAM_PORTRAIT_CACHE_VERSION } from "@/data/leadership-team";

type TeamPortraitImageProps = Omit<ImageProps, "unoptimized">;

/**
 * Renders portraits from `public/team/` without next/image optimization so
 * replaced files show up locally after a normal refresh (no stale _next/image cache).
 */
export function TeamPortraitImage({ src, ...props }: TeamPortraitImageProps) {
  const srcString = typeof src === "string" ? src : "";
  const isTeamAsset = srcString.startsWith("/team/");

  return (
    <Image
      key={isTeamAsset ? `${srcString}-${TEAM_PORTRAIT_CACHE_VERSION}` : srcString}
      src={src}
      unoptimized={isTeamAsset}
      {...props}
    />
  );
}
