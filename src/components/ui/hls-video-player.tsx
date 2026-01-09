"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Loader2, Lock, Play, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface HlsVideoPlayerProps {
  src: string | null;
  className?: string;
  autoPlay?: boolean;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onLoadedMetadata?: (duration: number) => void;
  initialPosition?: number;
  onError?: (error: string) => void;
}

export function HlsVideoPlayer({
  src,
  className,
  autoPlay = false,
  onTimeUpdate,
  onLoadedMetadata,
  initialPosition = 0,
  onError,
}: HlsVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const retryCountRef = useRef(0);

  const cleanup = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!src || !videoRef.current) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setRetryCount(0);
    retryCountRef.current = 0;
    const video = videoRef.current;

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      // Extract the CloudFront signature query string from the master playlist URL
      // This signature is valid for all files under the same path prefix (wildcard policy)
      const signatureQueryString = src.includes("?")
        ? src.substring(src.indexOf("?"))
        : "";

      // Extract base URL (everything before the filename, without query string)
      const urlWithoutQuery = src.split("?")[0];
      const lastSlashIndex = urlWithoutQuery.lastIndexOf("/");
      const baseUrl =
        lastSlashIndex !== -1
          ? urlWithoutQuery.substring(0, lastSlashIndex + 1)
          : "";

      console.log(
        "[HlsVideoPlayer] Master playlist:",
        src.substring(0, 100) + "..."
      );
      console.log("[HlsVideoPlayer] Base URL:", baseUrl);
      console.log(
        "[HlsVideoPlayer] Has signature:",
        signatureQueryString.length > 0
      );

      // Create custom loader that appends CloudFront signature to all HLS requests
      const DefaultLoader = Hls.DefaultConfig.loader;

      class SignedLoader extends DefaultLoader {
        constructor(config: any) {
          super(config);
        }

        load(
          context: Parameters<InstanceType<typeof DefaultLoader>["load"]>[0],
          config: Parameters<InstanceType<typeof DefaultLoader>["load"]>[1],
          callbacks: Parameters<InstanceType<typeof DefaultLoader>["load"]>[2]
        ) {
          // Only modify URLs that don't already have query params
          if (signatureQueryString && !context.url.includes("?")) {
            // For relative URLs (variant playlists and segments), they need the signature
            if (!context.url.startsWith("http")) {
              // Relative URL - prepend base URL and append signature
              context.url = baseUrl + context.url + signatureQueryString;
            } else if (context.url.startsWith(baseUrl)) {
              // Absolute URL under same base - append signature
              context.url = context.url + signatureQueryString;
            }
          }
          return super.load(context, config, callbacks);
        }
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        loader: SignedLoader,
        fragLoadingTimeOut: 20000, // Increase fragment load timeout to 20s
        manifestLoadingTimeOut: 20000, // Increase manifest load timeout
        fragLoadingMaxRetry: 4, // Retry up to 4 times
        manifestLoadingMaxRetry: 4,
        fragLoadingRetryDelay: 1000, // Wait 1s between retries
        manifestLoadingRetryDelay: 1000,
        xhrSetup: (xhr: XMLHttpRequest) => {
          // Ensure CORS is handled properly
          xhr.withCredentials = false;
          xhr.timeout = 20000; // Set XHR timeout to match HLS timeout
        },
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        setRetryCount(0);
        retryCountRef.current = 0;
        if (initialPosition > 0) {
          video.currentTime = initialPosition;
        }
        if (autoPlay) {
          video.play().catch((err) => {
            console.error("Auto-play failed:", err);
            setIsPlaying(false);
          });
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        const level = hls.levels[data.level];
        if (level) {
          const height = level.height;
          if (height) {
            setCurrentQuality(`${height}p`);
          } else {
            setCurrentQuality("Auto");
          }
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        // Only log fatal errors, non-fatal errors are handled automatically by HLS.js
        if (data.fatal) {
          console.error("HLS Fatal Error:", data);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (retryCountRef.current < 3) {
                retryCountRef.current += 1;
                setRetryCount(retryCountRef.current);
                setTimeout(() => {
                  if (hlsRef.current) {
                    hlsRef.current.startLoad();
                  }
                }, 1000 * retryCountRef.current);
              } else {
                setError(
                  `Network error: ${data.details || "Failed to load video"}`
                );
                onError?.(
                  `Network error: ${data.details || "Failed to load video"}`
                );
                setIsLoading(false);
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              if (retryCountRef.current < 3) {
                retryCountRef.current += 1;
                setRetryCount(retryCountRef.current);
                if (hlsRef.current) {
                  hlsRef.current.recoverMediaError();
                }
              } else {
                setError(
                  `Media error: ${data.details || "Failed to decode video"}`
                );
                onError?.(
                  `Media error: ${data.details || "Failed to decode video"}`
                );
                setIsLoading(false);
              }
              break;
            default:
              setError(`Error: ${data.details || "Unknown error occurred"}`);
              onError?.(`Error: ${data.details || "Unknown error occurred"}`);
              setIsLoading(false);
              if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
              }
              break;
          }
        }
      });

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        if (initialPosition > 0) {
          video.currentTime = initialPosition;
        }
        if (autoPlay) {
          video.play().catch((err) => {
            console.error("Auto-play failed:", err);
            setIsPlaying(false);
          });
        }
      });

      video.addEventListener("error", (e) => {
        console.error("Video error:", e);
        setError("Failed to load video");
        onError?.("Failed to load video");
        setIsLoading(false);
      });
    } else {
      setError("HLS is not supported in this browser");
      onError?.("HLS not supported");
      setIsLoading(false);
    }
  }, [src, initialPosition, autoPlay, onError]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (onTimeUpdate) {
        onTimeUpdate(video.currentTime, video.duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (onLoadedMetadata && video.duration) {
        onLoadedMetadata(video.duration);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, [onTimeUpdate, onLoadedMetadata]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const handleRetry = useCallback(() => {
    setError(null);
    setRetryCount(0);
    setIsLoading(true);
    if (hlsRef.current && src) {
      hlsRef.current.loadSource(src);
    }
  }, [src]);

  // Always render the video element so HLS.js can attach to it
  // Use overlays for loading/error states instead of conditional rendering
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-black aspect-video rounded-md",
        className
      )}
    >
      {/* Video element - always rendered so HLS.js can attach */}
      <video
        ref={videoRef}
        className={cn("w-full h-full", (isLoading || error) && "invisible")}
        controls
        playsInline
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Loading overlay */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
          <span className="ml-2 text-white text-sm">Loading video...</span>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-4">
          <AlertCircle className="h-8 w-8 mb-2 text-red-400" />
          <p className="text-sm mb-4 text-center">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="text-white border-white hover:bg-white hover:text-gray-900"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      )}

      {/* Quality indicator */}
      {currentQuality && !isLoading && !error && (
        <div className="absolute top-2 right-2 z-10 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
          {currentQuality}
        </div>
      )}
    </div>
  );
}
