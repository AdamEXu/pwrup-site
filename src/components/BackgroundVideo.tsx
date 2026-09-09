import { useEffect, useRef, useState } from "react";

type BackgroundVideoProps = {
    /** Flip to true on the beat; the whole layer fades in over fadeMs. */
    startFadeIn?: boolean;
    fadeMs?: number;
    className?: string;
};

// 24px-wide blurred first frame, so the beat always has *something* to fade in
// even before the real poster has arrived.
const LQIP =
    "data:image/webp;base64,UklGRpAAAABXRUJQVlA4IIQAAADQAwCdASoYAA4APu1iqU2ppaQiMAgBMB2JQBOmUABnIy6CRcVlqRgA3kPNimqx/lP7gsX79V3I5t4SH3CN/iEdKSCwd5L/hGWZBdArNsmI4QyAGsN8TROtebrBEj0/IQsX7FVRbJniaOIm9rmCSRiHwZbrV/EPymmwopTww9DjSISpvAA=";

// Ordered by efficiency; the browser takes the first <source> it can decode.
// Codec strings matter: without them Safari/Chrome will claim "maybe" for a
// bare video/mp4 and then fail on an AV1 stream they can't play.
// H.264 only exists at 480p: it is the fallback for hardware too old to
// decode AV1 or HEVC, which is never going to want 720p either.
const CODECS = [
    { file: "av1", type: 'video/mp4; codecs="av01.0.05M.08"', heights: [480, 720] },
    { file: "hevc", type: 'video/mp4; codecs="hvc1.1.6.L93.B0"', heights: [480, 720] },
    { file: "h264", type: 'video/mp4; codecs="avc1.64001F"', heights: [480] },
];

const MOBILE_BREAKPOINT = 768;

export default function BackgroundVideo({
    startFadeIn = false,
    fadeMs = 1000,
    className = "",
}: BackgroundVideoProps) {
    const layerRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [mounted, setMounted] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [posterLoaded, setPosterLoaded] = useState(false);
    const [videoVisible, setVideoVisible] = useState(false);
    const [height, setHeight] = useState(720);
    const [fadeDone, setFadeDone] = useState(false);

    // The opacity transition must be removed once the beat fade has finished,
    // otherwise every scroll tick would animate too.
    useEffect(() => {
        if (!startFadeIn) return;
        const t = setTimeout(() => setFadeDone(true), fadeMs);
        return () => clearTimeout(t);
    }, [startFadeIn, fadeMs]);

    useEffect(() => {
        setReducedMotion(
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
        setHeight(window.innerWidth < MOBILE_BREAKPOINT ? 480 : 720);
        setMounted(true);
    }, []);

    // Scroll fade/blur written straight to the DOM: this runs on every Lenis
    // frame and must not re-render React.
    useEffect(() => {
        if (reducedMotion) return;
        let raf = 0;
        const apply = () => {
            raf = 0;
            const el = layerRef.current;
            if (!el) return;
            const p = Math.min(window.scrollY / window.innerHeight, 1);
            const blur = p * 32;
            el.style.setProperty("--scroll-opacity", String(1 - p));
            el.style.filter = blur > 0.05 ? `blur(${blur}px)` : "";
            el.style.transform = `scale(${1 + blur * 0.05})`;
        };
        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(apply);
        };
        apply();
        window.addEventListener("scroll", onScroll, { passive: true });
        const lenis = (window as any).lenis;
        lenis?.on("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            lenis?.off("scroll", onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [reducedMotion]);

    useEffect(() => {
        if (reducedMotion) return;
        const onVis = () => {
            const v = videoRef.current;
            if (!v) return;
            if (document.hidden) v.pause();
            else v.play().catch(() => {});
        };
        document.addEventListener("visibilitychange", onVis);
        return () => document.removeEventListener("visibilitychange", onVis);
    }, [reducedMotion]);

    useEffect(() => {
        const v = videoRef.current;
        return () => {
            if (!v) return;
            try {
                v.pause();
                v.removeAttribute("src");
                v.load();
            } catch {}
        };
    }, []);

    const showVideo = mounted && !reducedMotion;

    return (
        <div
            className={`fixed inset-0 -z-10 overflow-hidden bg-black ${className}`}
            aria-hidden="true"
        >
            <div
                ref={layerRef}
                className="absolute inset-0"
                style={{
                    opacity: startFadeIn ? "var(--scroll-opacity, 1)" : 0,
                    transition:
                        startFadeIn && !fadeDone && !reducedMotion
                            ? `opacity ${fadeMs}ms ease-out`
                            : "none",
                    willChange: "opacity",
                }}
            >
                <img
                    src={LQIP}
                    alt=""
                    decoding="sync"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <picture>
                    <source srcSet="/video/poster.avif" type="image/avif" />
                    <source srcSet="/video/poster.webp" type="image/webp" />
                    <img
                        src="/video/poster.jpg"
                        alt=""
                        fetchPriority="high"
                        decoding="async"
                        onLoad={() => setPosterLoaded(true)}
                        className="absolute inset-0 h-full w-full object-cover"
                        style={{
                            opacity: posterLoaded ? 1 : 0,
                            transition: "opacity 200ms linear",
                        }}
                    />
                </picture>
                {showVideo && (
                    <video
                        ref={videoRef}
                        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
                        style={{
                            opacity: videoVisible ? 1 : 0,
                            transition: "opacity 300ms linear",
                        }}
                        tabIndex={-1}
                        muted
                        playsInline
                        autoPlay
                        loop
                        preload="auto"
                        disableRemotePlayback
                        disablePictureInPicture
                        // "playing" rather than "canplay": the first frame is
                        // guaranteed painted, so the poster→video swap is a
                        // no-op visually.
                        onPlaying={() => setVideoVisible(true)}
                    >
                        {CODECS.map((c) => (
                            <source
                                key={c.file}
                                src={`/video/bg-${c.file}-${
                                    c.heights.includes(height) ? height : c.heights[0]
                                }.mp4`}
                                type={c.type}
                            />
                        ))}
                    </video>
                )}
                <div className="absolute inset-0 bg-black/30" />
            </div>
        </div>
    );
}
