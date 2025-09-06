"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

type Source = { src: string; type: string };

type BackgroundVideoProps = {
    /** HLS stream URL (takes priority over sources) */
    hlsUrl?: string;
    /** Preferred first (e.g., WebM), with MP4 fallback */
    sources?: Source[];
    /** Poster shown before playback */
    poster?: string;
    /** Fade-in duration ms */
    fadeMs?: number;
    /** Delay before we even *mount* the video element (ms) to avoid competing with critical work */
    mountDelayMs?: number;
    /** Extra wrapper classes */
    className?: string;
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
}: BackgroundVideoProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    const [shouldMount, setShouldMount] = useState(false); // create the <video> at all?
    const [visible, setVisible] = useState(false); // in viewport?
    const [ready, setReady] = useState(false); // fade in when can play

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
            });

            hlsRef.current = hls;
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {});
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.warn("HLS error:", data);
                if (data.fatal) {
                    setReady(true); // Show video even on error to avoid staying transparent
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
            setReady(true);
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

    // If user prefers reduced motion, just render a poster image
    if (prefersReducedMotion) {
        return (
            <div
                ref={containerRef}
                className={`fixed inset-0 -z-10 bg-black ${className}`}
                aria-hidden="true"
            >
                <img
                    src={poster}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none select-none"
                    loading="eager"
                />
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 -z-10 overflow-hidden bg-black ${className}`}
            aria-hidden="true"
        >
            {shouldMount && visible && (
                <video
                    ref={videoRef}
                    className={`absolute inset-0 h-full w-full object-cover pointer-events-none transition-opacity duration-[${fadeMs}ms] ${
                        ready ? "opacity-100" : "opacity-0"
                    }`}
                    // Keep it as a decorative, auto-playing background
                    tabIndex={-1}
                    muted
                    playsInline
                    autoPlay
                    loop
                    // CRUCIAL: don’t grab the whole file up front
                    preload="metadata"
                    // nice UX while waiting
                    onCanPlay={() => setReady(true)}
                    onError={() => setReady(true)} // avoid staying transparent on error
                    disableRemotePlayback
                >
                    {/* Only use fallback sources if HLS is not supported */}
                    {!hlsUrl}
                </video>
            )}
        </div>
    );
}
