"use client";
import { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle, } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Loader2, AlertCircle, RefreshCw, SkipBack, SkipForward, PictureInPicture2, Subtitles, Check, ChevronLeft, } from "lucide-react";
interface QualityLevel {
    index: number;
    height: number;
    width: number;
    bitrate: number;
    name: string;
}
interface SubtitleTrack {
    id: number;
    name: string;
    lang: string;
    default: boolean;
}
interface EnhancedVideoPlayerProps {
    src: string | null;
    className?: string;
    autoPlay?: boolean;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    onLoadedMetadata?: (duration: number) => void;
    initialPosition?: number;
    onError?: (error: string) => void;
    onEnded?: () => void;
    poster?: string;
    title?: string;
}
export interface EnhancedVideoPlayerRef {
    play: () => void;
    pause: () => void;
    seek: (time: number) => void;
    getCurrentTime: () => number;
    getDuration: () => number;
}
const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds))
        return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};
type SettingsMenu = "main" | "quality" | "speed" | "subtitles";
export const EnhancedVideoPlayer = forwardRef<EnhancedVideoPlayerRef, EnhancedVideoPlayerProps>(({ src, className, autoPlay = false, onTimeUpdate, onLoadedMetadata, initialPosition = 0, onError, onEnded, poster, title, }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [isPiP, setIsPiP] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settingsMenu, setSettingsMenu] = useState<SettingsMenu>("main");
    const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
    const [currentQuality, setCurrentQuality] = useState<number>(-1);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [subtitleTracks, setSubtitleTracks] = useState<SubtitleTrack[]>([]);
    const [currentSubtitle, setCurrentSubtitle] = useState<number>(-1);
    useImperativeHandle(ref, () => ({
        play: () => videoRef.current?.play(),
        pause: () => videoRef.current?.pause(),
        seek: (time: number) => {
            if (videoRef.current)
                videoRef.current.currentTime = time;
        },
        getCurrentTime: () => videoRef.current?.currentTime ?? 0,
        getDuration: () => videoRef.current?.duration ?? 0,
    }));
    const resetHideControlsTimer = useCallback(() => {
        if (hideControlsTimeout.current) {
            clearTimeout(hideControlsTimeout.current);
        }
        setShowControls(true);
        if (isPlaying) {
            hideControlsTimeout.current = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
    }, [isPlaying]);
    useEffect(() => {
        if (!src || !videoRef.current) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        const video = videoRef.current;
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }
        if (Hls.isSupported()) {
            const signatureQueryString = src.includes("?")
                ? src.substring(src.indexOf("?"))
                : "";
            const urlWithoutQuery = src.split("?")[0];
            const lastSlashIndex = urlWithoutQuery.lastIndexOf("/");
            const baseUrl = lastSlashIndex !== -1
                ? urlWithoutQuery.substring(0, lastSlashIndex + 1)
                : "";
            const DefaultLoader = Hls.DefaultConfig.loader;
            class SignedLoader extends DefaultLoader {
                load(context: Parameters<InstanceType<typeof DefaultLoader>["load"]>[0], config: Parameters<InstanceType<typeof DefaultLoader>["load"]>[1], callbacks: Parameters<InstanceType<typeof DefaultLoader>["load"]>[2]) {
                    if (signatureQueryString && !context.url.includes("?")) {
                        if (!context.url.startsWith("http")) {
                            context.url = baseUrl + context.url + signatureQueryString;
                        }
                        else if (context.url.startsWith(baseUrl)) {
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
                startLevel: -1,
                fragLoadingTimeOut: 20000,
                manifestLoadingTimeOut: 20000,
                fragLoadingMaxRetry: 4,
                manifestLoadingMaxRetry: 4,
                fragLoadingRetryDelay: 1000,
                manifestLoadingRetryDelay: 1000,
                maxBufferLength: 30,
                maxMaxBufferLength: 60,
                maxBufferSize: 60 * 1000 * 1000,
                maxBufferHole: 0.5,
                xhrSetup: (xhr: XMLHttpRequest, url: string) => {
                    xhr.timeout = 20000;
                    xhr.withCredentials = false;
                },
            });
            hlsRef.current = hls;
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
                setIsLoading(false);
                const levels: QualityLevel[] = data.levels.map((level, index) => ({
                    index,
                    height: level.height,
                    width: level.width,
                    bitrate: level.bitrate,
                    name: `${level.height}p`,
                }));
                setQualityLevels(levels.sort((a, b) => b.height - a.height));
                if (initialPosition > 0) {
                    video.currentTime = initialPosition;
                }
                if (autoPlay) {
                    video.play().catch(() => { });
                }
            });
            hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, data) => {
                const tracks: SubtitleTrack[] = data.subtitleTracks.map((track, idx) => ({
                    id: idx,
                    name: track.name || track.lang || `Track ${idx + 1}`,
                    lang: track.lang || "",
                    default: track.default ?? false,
                }));
                setSubtitleTracks(tracks);
            });
            hls.on(Hls.Events.ERROR, (_, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            try {
                                hls.startLoad();
                            }
                            catch (e) {
                                void e;
                                setError("Network error - please check your connection");
                                onError?.("Network error - please check your connection");
                                setIsLoading(false);
                            }
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            try {
                                hls.recoverMediaError();
                            }
                            catch (e) {
                                void e;
                                setError("Media error - failed to decode video");
                                onError?.("Media error - failed to decode video");
                                setIsLoading(false);
                            }
                            break;
                        default:
                            setError("An error occurred while loading the video");
                            onError?.(data.details || "Unknown error");
                            setIsLoading(false);
                            break;
                    }
                }
            });
            return () => {
                hls.destroy();
                hlsRef.current = null;
            };
        }
        else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            video.addEventListener("loadedmetadata", () => {
                setIsLoading(false);
                if (initialPosition > 0)
                    video.currentTime = initialPosition;
                if (autoPlay)
                    video.play().catch(() => { });
            });
            video.addEventListener("error", () => {
                setError("Failed to load video");
                onError?.("Failed to load video");
                setIsLoading(false);
            });
        }
        else {
            setError("HLS is not supported in this browser");
            onError?.("HLS not supported");
            setIsLoading(false);
        }
    }, [src, initialPosition, autoPlay, onError]);
    useEffect(() => {
        const video = videoRef.current;
        if (!video)
            return;
        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            onTimeUpdate?.(video.currentTime, video.duration);
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                setBuffered((bufferedEnd / video.duration) * 100);
            }
        };
        const handleLoadedMetadata = () => {
            setDuration(video.duration);
            onLoadedMetadata?.(video.duration);
        };
        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => {
            setIsPlaying(false);
            setShowControls(true);
        };
        const handleEnded = () => {
            setIsPlaying(false);
            setShowControls(true);
            onEnded?.();
        };
        const handleVolumeChange = () => {
            setVolume(video.volume);
            setIsMuted(video.muted);
        };
        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("play", handlePlay);
        video.addEventListener("pause", handlePause);
        video.addEventListener("ended", handleEnded);
        video.addEventListener("volumechange", handleVolumeChange);
        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("play", handlePlay);
            video.removeEventListener("pause", handlePause);
            video.removeEventListener("ended", handleEnded);
            video.removeEventListener("volumechange", handleVolumeChange);
        };
    }, [onTimeUpdate, onLoadedMetadata, onEnded]);
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);
    useEffect(() => {
        const video = videoRef.current;
        if (!video)
            return;
        const handlePiPEnter = () => setIsPiP(true);
        const handlePiPExit = () => setIsPiP(false);
        video.addEventListener("enterpictureinpicture", handlePiPEnter);
        video.addEventListener("leavepictureinpicture", handlePiPExit);
        return () => {
            video.removeEventListener("enterpictureinpicture", handlePiPEnter);
            video.removeEventListener("leavepictureinpicture", handlePiPExit);
        };
    }, []);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!containerRef.current?.contains(document.activeElement))
                return;
            const video = videoRef.current;
            if (!video)
                return;
            switch (e.key.toLowerCase()) {
                case " ":
                case "k":
                    e.preventDefault();
                    video.paused ? video.play() : video.pause();
                    break;
                case "f":
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case "m":
                    e.preventDefault();
                    toggleMute();
                    break;
                case "arrowleft":
                    e.preventDefault();
                    video.currentTime = Math.max(0, video.currentTime - 10);
                    break;
                case "arrowright":
                    e.preventDefault();
                    video.currentTime = Math.min(duration, video.currentTime + 10);
                    break;
                case "arrowup":
                    e.preventDefault();
                    video.volume = Math.min(1, video.volume + 0.1);
                    break;
                case "arrowdown":
                    e.preventDefault();
                    video.volume = Math.max(0, video.volume - 0.1);
                    break;
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    e.preventDefault();
                    video.currentTime = (duration * parseInt(e.key)) / 10;
                    break;
            }
            resetHideControlsTimer();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [duration, resetHideControlsTimer]);
    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video)
            return;
        video.paused ? video.play() : video.pause();
    }, []);
    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        if (!video)
            return;
        video.muted = !video.muted;
    }, []);
    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const video = videoRef.current;
        if (!video)
            return;
        const newVolume = parseFloat(e.target.value);
        video.volume = newVolume;
        if (newVolume > 0)
            video.muted = false;
    }, []);
    const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        const progress = progressRef.current;
        if (!video || !progress)
            return;
        const rect = progress.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * duration;
    }, [duration]);
    const toggleFullscreen = useCallback(() => {
        const container = containerRef.current;
        if (!container)
            return;
        if (!document.fullscreenElement) {
            container.requestFullscreen?.();
        }
        else {
            document.exitFullscreen?.();
        }
    }, []);
    const togglePiP = useCallback(async () => {
        const video = videoRef.current;
        if (!video)
            return;
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            }
            else if (document.pictureInPictureEnabled) {
                await video.requestPictureInPicture();
            }
        }
        catch (err) {
            void err;
        }
    }, []);
    const handleQualityChange = useCallback((levelIndex: number) => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = levelIndex;
            setCurrentQuality(levelIndex);
        }
        setShowSettings(false);
        setSettingsMenu("main");
    }, []);
    const handleSpeedChange = useCallback((speed: number) => {
        const video = videoRef.current;
        if (video) {
            video.playbackRate = speed;
            setPlaybackSpeed(speed);
        }
        setShowSettings(false);
        setSettingsMenu("main");
    }, []);
    const handleSubtitleChange = useCallback((trackId: number) => {
        if (hlsRef.current) {
            hlsRef.current.subtitleTrack = trackId;
            setCurrentSubtitle(trackId);
        }
        setShowSettings(false);
        setSettingsMenu("main");
    }, []);
    const skipBack = useCallback(() => {
        const video = videoRef.current;
        if (video)
            video.currentTime = Math.max(0, video.currentTime - 10);
    }, []);
    const skipForward = useCallback(() => {
        const video = videoRef.current;
        if (video)
            video.currentTime = Math.min(duration, video.currentTime + 10);
    }, [duration]);
    const handleRetry = useCallback(() => {
        setError(null);
        setIsLoading(true);
        if (hlsRef.current && src) {
            hlsRef.current.loadSource(src);
        }
    }, [src]);
    const getCurrentQualityLabel = () => {
        if (currentQuality === -1) {
            const autoLevel = hlsRef.current?.currentLevel ?? -1;
            const level = qualityLevels.find((q) => q.index === autoLevel);
            return level ? `Auto (${level.name})` : "Auto";
        }
        const level = qualityLevels.find((q) => q.index === currentQuality);
        return level?.name || "Unknown";
    };
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    return (<div ref={containerRef} className={cn("group relative overflow-hidden bg-black aspect-video rounded-lg select-none", className)} onMouseMove={resetHideControlsTimer} onMouseLeave={() => isPlaying && setShowControls(false)} tabIndex={0}>
        
        <video ref={videoRef} className="w-full h-full object-contain" playsInline poster={poster} onClick={togglePlay} onDoubleClick={toggleFullscreen}/>

        
        {isLoading && !error && (<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <Loader2 className="h-12 w-12 text-primary animate-spin"/>
            <span className="mt-3 text-white/80 text-sm">Loading video...</span>
          </div>)}

        
        {error && (<div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black z-20 p-6">
            <AlertCircle className="h-12 w-12 text-red-400 mb-3"/>
            <p className="text-white text-center mb-4">{error}</p>
            <button onClick={handleRetry} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition text-white">
              <RefreshCw className="h-4 w-4"/>
              Try Again
            </button>
          </div>)}

        
        {title && showControls && !error && (<div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 transition-opacity duration-300">
            <h3 className="text-white font-medium truncate">{title}</h3>
          </div>)}

        
        {!isPlaying && !isLoading && !error && (<button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center z-10">
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition group-hover:scale-105">
              <Play className="h-10 w-10 text-white ml-1" fill="white"/>
            </div>
          </button>)}

        
        <div className={cn("absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-10 transition-all duration-300", showControls || !isPlaying
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none")}>
          
          <div ref={progressRef} className="relative h-1 mx-4 mb-2 cursor-pointer group/progress" onClick={handleSeek}>
            
            <div className="absolute inset-0 bg-white/20 rounded-full">
              <div className="absolute inset-y-0 left-0 bg-white/40 rounded-full" style={{ width: `${buffered}%` }}/>
            </div>
            
            <div className="absolute inset-y-0 left-0 bg-primary rounded-full" style={{ width: `${progress}%` }}/>
            
            <div className="absolute inset-0 -top-2 -bottom-2 rounded-full transition-all group-hover/progress:bg-white/5"/>
            
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition shadow-lg" style={{ left: `calc(${progress}% - 6px)` }}/>
          </div>

          
          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-1">
              
              <button onClick={togglePlay} className="p-2 rounded-lg hover:bg-white/10 transition text-white" aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? (<Pause className="h-5 w-5" fill="white"/>) : (<Play className="h-5 w-5" fill="white"/>)}
              </button>

              
              <button onClick={skipBack} className="p-2 rounded-lg hover:bg-white/10 transition text-white" aria-label="Skip back 10 seconds">
                <SkipBack className="h-5 w-5"/>
              </button>

              
              <button onClick={skipForward} className="p-2 rounded-lg hover:bg-white/10 transition text-white" aria-label="Skip forward 10 seconds">
                <SkipForward className="h-5 w-5"/>
              </button>

              
              <div className="flex items-center group/volume">
                <button onClick={toggleMute} className="p-2 rounded-lg hover:bg-white/10 transition text-white" aria-label={isMuted ? "Unmute" : "Mute"}>
                  {isMuted || volume === 0 ? (<VolumeX className="h-5 w-5"/>) : (<Volume2 className="h-5 w-5"/>)}
                </button>
                <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume} onChange={handleVolumeChange} className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-primary h-1 cursor-pointer" aria-label="Volume"/>
              </div>

              
              <span className="text-white/80 text-sm ml-2 tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              
              {subtitleTracks.length > 0 && (<button onClick={() => {
                setShowSettings(true);
                setSettingsMenu("subtitles");
            }} className={cn("p-2 rounded-lg hover:bg-white/10 transition", currentSubtitle >= 0 ? "text-primary" : "text-white")} aria-label="Subtitles">
                  <Subtitles className="h-5 w-5"/>
                </button>)}

              
              <button onClick={() => {
            setShowSettings(!showSettings);
            setSettingsMenu("main");
        }} className="p-2 rounded-lg hover:bg-white/10 transition text-white" aria-label="Settings">
                <Settings className={cn("h-5 w-5 transition-transform duration-300", showSettings && "rotate-45")}/>
              </button>

              
              {typeof document !== "undefined" &&
            document.pictureInPictureEnabled && (<button onClick={togglePiP} className={cn("p-2 rounded-lg hover:bg-white/10 transition", isPiP ? "text-primary" : "text-white")} aria-label="Picture in Picture">
                    <PictureInPicture2 className="h-5 w-5"/>
                  </button>)}

              
              <button onClick={toggleFullscreen} className="p-2 rounded-lg hover:bg-white/10 transition text-white" aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
                {isFullscreen ? (<Minimize className="h-5 w-5"/>) : (<Maximize className="h-5 w-5"/>)}
              </button>
            </div>
          </div>

          
          {showSettings && (<div className="absolute bottom-16 right-4 w-56 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-2xl overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
              {settingsMenu === "main" && (<div className="p-1">
                  <button onClick={() => setSettingsMenu("quality")} className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-md transition text-white">
                    <span className="text-sm">Quality</span>
                    <span className="text-xs text-white/60">
                      {getCurrentQualityLabel()}
                    </span>
                  </button>
                  <button onClick={() => setSettingsMenu("speed")} className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-md transition text-white">
                    <span className="text-sm">Playback Speed</span>
                    <span className="text-xs text-white/60">
                      {playbackSpeed}x
                    </span>
                  </button>
                  {subtitleTracks.length > 0 && (<button onClick={() => setSettingsMenu("subtitles")} className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-md transition text-white">
                      <span className="text-sm">Subtitles</span>
                      <span className="text-xs text-white/60">
                        {currentSubtitle >= 0
                        ? subtitleTracks.find((t) => t.id === currentSubtitle)
                            ?.name
                        : "Off"}
                      </span>
                    </button>)}
                </div>)}

              {settingsMenu === "quality" && (<div className="p-1">
                  <button onClick={() => setSettingsMenu("main")} className="w-full flex items-center gap-2 p-3 hover:bg-white/10 rounded-md transition text-white border-b border-white/10">
                    <ChevronLeft className="h-4 w-4"/>
                    <span className="text-sm font-medium">Quality</span>
                  </button>
                  <button onClick={() => handleQualityChange(-1)} className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-md transition text-white">
                    <span className="text-sm">Auto</span>
                    {currentQuality === -1 && (<Check className="h-4 w-4 text-primary"/>)}
                  </button>
                  {qualityLevels.map((level) => (<button key={level.index} onClick={() => handleQualityChange(level.index)} className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-md transition text-white">
                      <span className="text-sm">{level.name}</span>
                      {currentQuality === level.index && (<Check className="h-4 w-4 text-primary"/>)}
                    </button>))}
                </div>)}

              {settingsMenu === "speed" && (<div className="p-1">
                  <button onClick={() => setSettingsMenu("main")} className="w-full flex items-center gap-2 p-3 hover:bg-white/10 rounded-md transition text-white border-b border-white/10">
                    <ChevronLeft className="h-4 w-4"/>
                    <span className="text-sm font-medium">Playback Speed</span>
                  </button>
                  {PLAYBACK_SPEEDS.map((speed) => (<button key={speed} onClick={() => handleSpeedChange(speed)} className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-md transition text-white">
                      <span className="text-sm">
                        {speed === 1 ? "Normal" : `${speed}x`}
                      </span>
                      {playbackSpeed === speed && (<Check className="h-4 w-4 text-primary"/>)}
                    </button>))}
                </div>)}

              {settingsMenu === "subtitles" && (<div className="p-1">
                  <button onClick={() => setSettingsMenu("main")} className="w-full flex items-center gap-2 p-3 hover:bg-white/10 rounded-md transition text-white border-b border-white/10">
                    <ChevronLeft className="h-4 w-4"/>
                    <span className="text-sm font-medium">Subtitles</span>
                  </button>
                  <button onClick={() => handleSubtitleChange(-1)} className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-md transition text-white">
                    <span className="text-sm">Off</span>
                    {currentSubtitle === -1 && (<Check className="h-4 w-4 text-primary"/>)}
                  </button>
                  {subtitleTracks.map((track) => (<button key={track.id} onClick={() => handleSubtitleChange(track.id)} className="w-full flex items-center justify-between p-3 hover:bg-white/10 rounded-md transition text-white">
                      <span className="text-sm">{track.name}</span>
                      {currentSubtitle === track.id && (<Check className="h-4 w-4 text-primary"/>)}
                    </button>))}
                </div>)}
            </div>)}
        </div>

        
        {showSettings && (<div className="absolute inset-0 z-5" onClick={() => {
                setShowSettings(false);
                setSettingsMenu("main");
            }}/>)}
      </div>);
});
EnhancedVideoPlayer.displayName = "EnhancedVideoPlayer";
