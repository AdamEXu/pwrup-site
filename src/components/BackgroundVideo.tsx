"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

type Source = { src: string; type: string };

type BackgroundVideoProps = {
    /** HLS stream URL (takes priority over sources) */
    hlsUrl?: string;
    /** Preferred first (e.g., WebM), with MP4 fallback */
    sources?: Source[];
    /** Fade-in duration ms */
    fadeMs?: number;
    /** Delay before we even *mount* the video element (ms) to avoid competing with critical work */
    mountDelayMs?: number;
    /** Extra wrapper classes */
    className?: string;
    /** External trigger to start the fade-in animation */
    startFadeIn?: boolean;
};

/**
 * Non-blocking background video:
 * - Lazy mounts after first paint/idle + only when visible
 * - preload="metadata" (don’t fetch full file up front)
 * - Lets the browser stream/buffer (no custom buffering)
 * - Respects reduced motion & tab visibility
 */
export default function BackgroundVideo({
    hlsUrl = "https://cdn.pinewood.one/homepage_background_video/hls/master.m3u8",
    fadeMs = 500,
    mountDelayMs = 100,
    className = "",
    startFadeIn = false,
}: BackgroundVideoProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    const [shouldMount, setShouldMount] = useState(false); // create the <video> at all?
    const [visible, setVisible] = useState(false); // in viewport?
    const [videoReady, setVideoReady] = useState(false); // video can play
    const [shouldFadeIn, setShouldFadeIn] = useState(false); // external trigger received and video ready
    const [fadeInComplete, setFadeInComplete] = useState(false); // fade-in animation finished
    const [scrollOpacity, setScrollOpacity] = useState(1); // scroll-based opacity multiplier
    const [scrollBlur, setScrollBlur] = useState(0); // scroll-based blur in pixels

    // Respect OS-level reduced motion: show poster only, never mount video
    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    // Delay *mounting* the <video> until after first paint/idle so your other JS runs freely
    useEffect(() => {
        if (prefersReducedMotion) return; // skip entirely
        let canceled = false;

        const start = () => {
            if (!canceled) setShouldMount(true);
        };

        // Prefer requestIdleCallback; fall back to a short timeout
        const w = window as any;
        const id =
            w.requestIdleCallback?.(start, { timeout: mountDelayMs }) ??
            window.setTimeout(start, mountDelayMs);

        return () => {
            canceled = true;
            if (w.cancelIdleCallback) w.cancelIdleCallback(id);
            else clearTimeout(id);
        };
    }, [mountDelayMs, prefersReducedMotion]);

    // Only load when the container is (about to be) visible
    useEffect(() => {
        if (!shouldMount || prefersReducedMotion) return;
        const el = containerRef.current;
        if (!el) return;

        const io = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setVisible(entry.isIntersecting || entry.intersectionRatio > 0);
            },
            { root: null, rootMargin: "400px", threshold: 0.01 } // pre-warm slightly before it scrolls in
        );
        io.observe(el);
        return () => io.disconnect();
    }, [shouldMount, prefersReducedMotion]);

    // Initialize HLS when video is visible and mounted
    useEffect(() => {
        if (!shouldMount || !visible || prefersReducedMotion || !hlsUrl) return;

        const video = videoRef.current;
        if (!video) return;

        // Clean up any existing HLS instance
        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        if (Hls.isSupported()) {
            // Use HLS.js for browsers that support it
            const hls = new Hls({
                enableWorker: false, // Disable worker for better compatibility
                lowLatencyMode: false,
                backBufferLength: 90,
                // Start with higher quality assumptions
                startLevel: -1, // Let HLS.js auto-select, but with better defaults below
                capLevelToPlayerSize: false, // Don't limit quality based on player size
                maxLoadingDelay: 4,
                maxBufferLength: 30,
                maxBufferSize: 60 * 1000 * 1000, // 60MB buffer
                // Aggressive bandwidth estimation for better initial quality
                abrEwmaDefaultEstimate: 5000000, // Start assuming 5Mbps instead of default ~500kbps
                abrEwmaSlowVoD: 3, // Faster adaptation for VoD content
                abrEwmaFastVoD: 3,
                abrMaxWithRealBitrate: false, // Don't be overly conservative
                // Quality switching
                abrBandWidthFactor: 0.7, // Less conservative bandwidth factor
                abrBandWidthUpFactor: 0.7, // Less conservative for upward switches
            });

            hlsRef.current = hls;
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // Force start with a higher quality level
                const levels = hls.levels;
                if (levels.length > 1) {
                    // Start with at least 720p if available, or second-highest quality
                    const targetLevel = levels.findIndex(
                        (level) => level.height >= 720
                    );
                    if (targetLevel !== -1) {
                        hls.startLevel = targetLevel;
                    } else if (levels.length > 2) {
                        // If no 720p, use second-highest quality
                        hls.startLevel = levels.length - 2;
                    }
                }
                video.play().catch(() => {});
            });

            hls.on(Hls.Events.ERROR, (_, data) => {
                console.warn("HLS error:", data);
                if (data.fatal) {
                    setVideoReady(true); // Show video even on error to avoid staying transparent
                }
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            // Safari native HLS support
            video.src = hlsUrl;
            video.addEventListener("loadedmetadata", () => {
                video.play().catch(() => {});
            });
        } else {
            console.warn("HLS not supported, falling back to regular sources");
            setVideoReady(true);
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [shouldMount, visible, prefersReducedMotion, hlsUrl]);

    // Pause on hidden tab, resume on visible
    useEffect(() => {
        if (!shouldMount || prefersReducedMotion) return;
        const onVis = () => {
            const v = videoRef.current;
            if (!v) return;
            if (document.hidden) v.pause();
            else v.play().catch(() => {});
        };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, [shouldMount, prefersReducedMotion]);

    // Handle scroll-based opacity and blur effects
    useEffect(() => {
        if (prefersReducedMotion) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Calculate scroll progress from 0 to 1 (0vh to 100vh)
            const scrollProgress = Math.min(scrollY / windowHeight, 1);

            // Opacity multiplier: 1 at top, 0 at 100vh
            const opacityMultiplier = 1 - scrollProgress;

            // Blur: 0px at top, 32px at 100vh
            const blurAmount = scrollProgress * 32;

            setScrollOpacity(opacityMultiplier);
            setScrollBlur(blurAmount);
        };

        // Initial calculation
        handleScroll();

        // Listen to both native scroll and Lenis scroll events
        window.addEventListener("scroll", handleScroll);

        // Also listen to Lenis scroll events if available
        const checkLenis = () => {
            const lenis = (window as any).lenis;
            if (lenis) {
                lenis.on("scroll", handleScroll);
                return () => lenis.off("scroll", handleScroll);
            }
            return null;
        };

        // Try to attach Lenis listener immediately, or wait a bit for it to initialize
        let lenisCleanup = checkLenis();
        const lenisTimeout = setTimeout(() => {
            if (!lenisCleanup) {
                lenisCleanup = checkLenis();
            }
        }, 100);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (lenisCleanup) lenisCleanup();
            clearTimeout(lenisTimeout);
        };
    }, [prefersReducedMotion]);

    // Handle external fade-in trigger combined with video readiness
    useEffect(() => {
        if (videoReady && startFadeIn) {
            setShouldFadeIn(true);
            // Mark fade-in as complete after the animation duration
            const timer = setTimeout(() => {
                setFadeInComplete(true);
            }, fadeMs);
            return () => clearTimeout(timer);
        }
    }, [videoReady, startFadeIn, fadeMs]);

    // Clean up GPU/memory on unmount
    useEffect(() => {
        return () => {
            // Clean up HLS
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }

            // Clean up video
            const v = videoRef.current;
            if (!v) return;
            try {
                v.pause();
                v.removeAttribute("src");
                v.srcObject = null;
                v.load();
            } catch {}
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 -z-10 overflow-hidden bg-black ${className}`}
            aria-hidden="true"
        >
            {shouldMount && visible && (
                <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                    style={{
                        opacity: shouldFadeIn ? scrollOpacity : 0,
                        filter: `blur(${scrollBlur}px)`,
                        transform: `scale(${1 + scrollBlur * 0.05})`, // Scale up slightly to compensate for blur edge sampling
                        transition:
                            shouldFadeIn && !fadeInComplete
                                ? `opacity ${fadeMs}ms ease-in-out`
                                : "none",
                    }}
                    // Keep it as a decorative, auto-playing background
                    tabIndex={-1}
                    muted
                    playsInline
                    autoPlay
                    loop
                    // CRUCIAL: don’t grab the whole file up front
                    preload="metadata"
                    // nice UX while waiting
                    onCanPlay={() => setVideoReady(true)}
                    onError={() => setVideoReady(true)} // avoid staying transparent on error
                    disableRemotePlayback
                >
                    {/* Only use fallback sources if HLS is not supported */}
                    {!hlsUrl}
                </video>
            )}
        </div>
    );
}
