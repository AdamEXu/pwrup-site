import { useEffect, useRef, useState } from "react";

export default function BackgroundVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [startTime] = useState(() => Math.random() * 60); // Random start between 0-60 seconds
    const [shouldLoad, setShouldLoad] = useState(false);

    // Delay video loading to let page content load first
    useEffect(() => {
        const timer = setTimeout(() => {
            setShouldLoad(true);
        }, 500); // Slightly longer delay to ensure page is fully rendered

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !shouldLoad) return;

        // Set video properties for optimal loading
        video.preload = "auto";
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.crossOrigin = "anonymous"; // Help with loading

        // Force loading to start immediately
        video.load();

        const handleLoadedMetadata = () => {
            // Set random start time after metadata is loaded
            video.currentTime = startTime;
        };

        const handleCanPlay = () => {
            // Only play if not already loaded to avoid duplicate calls
            if (!isLoaded) {
                setIsLoaded(true);
                video.play().catch(console.error);
            }
        };

        const handleLoadedData = () => {
            // Start playing when we have loaded data
            setIsLoaded(true);
            video.play().catch(console.error);
        };

        const handleProgress = () => {
            // Continue loading the entire video in background
            if (video.buffered.length > 0) {
                const bufferedEnd = video.buffered.end(
                    video.buffered.length - 1
                );
                const duration = video.duration;

                // Log progress for debugging
                console.log(
                    `Video buffered: ${Math.round(
                        (bufferedEnd / duration) * 100
                    )}%`
                );
            }
        };

        const handleTimeUpdate = () => {
            // Handle looping with our custom start time (no fade effect on loop)
            if (video.currentTime >= video.duration - 0.1) {
                video.currentTime = startTime;
            }
        };

        const handleEnded = () => {
            // Ensure seamless looping (no fade effect on loop)
            video.currentTime = startTime;
            video.play().catch(console.error);
        };

        // Add event listeners
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("progress", handleProgress);
        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("ended", handleEnded);

        // Video loading already started above

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("canplay", handleCanPlay);
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("progress", handleProgress);
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("ended", handleEnded);
        };
    }, [startTime, shouldLoad]);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
            {/* Video element that fades in from black */}
            {shouldLoad && (
                <video
                    ref={videoRef}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                        isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                    src="https://cdn.pinewood.one/Robot.webm"
                    muted
                    playsInline
                    loop
                    preload="auto"
                />
            )}
        </div>
        // for testing
        // <div className="fixed inset-0 -z-10 overflow-hidden bg-white"></div>
    );
}
