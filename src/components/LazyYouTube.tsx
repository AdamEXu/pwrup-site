import { useState, useRef, useEffect } from "react";

interface LazyYouTubeProps {
    videoId: string;
    title?: string;
    className?: string;
}

export default function LazyYouTube({
    videoId,
    title = "YouTube video",
    className = "",
}: LazyYouTubeProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handlePlay = () => {
        setIsLoaded(true);
    };

    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return (
        <div
            ref={containerRef}
            className={`aspect-video relative ${className}`}
        >
            {!isLoaded ? (
                <div
                    className="w-full h-full bg-black rounded-lg cursor-pointer relative overflow-hidden group"
                    onClick={handlePlay}
                >
                    {isVisible && (
                        <>
                            <img
                                src={thumbnailUrl}
                                alt={title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-20 transition-all duration-200">
                                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 16"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g>
                                            <rect
                                                height="16.416"
                                                opacity="0"
                                                width="16.2891"
                                                x="0"
                                                y="0"
                                            />
                                            <path
                                                d="M1.70898 14.9805C1.70898 15.9473 2.26562 16.4062 2.92969 16.4062C3.22266 16.4062 3.52539 16.3086 3.82812 16.1523L15.2051 9.50195C16.0156 9.0332 16.2891 8.71094 16.2891 8.20312C16.2891 7.68555 16.0156 7.37305 15.2051 6.9043L3.82812 0.253906C3.52539 0.0878906 3.22266 0 2.92969 0C2.26562 0 1.70898 0.458984 1.70898 1.42578Z"
                                                fill="#70CD35"
                                                fill-opacity="0.85"
                                            />
                                        </g>
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-[#70cd35] text-xs px-2 py-1 rounded">
                                {title}
                            </div>
                        </>
                    )}
                    {!isVisible && (
                        <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center">
                            <div className="text-gray-400">Loading...</div>
                        </div>
                    )}
                </div>
            ) : (
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={title}
                />
            )}
        </div>
    );
}
