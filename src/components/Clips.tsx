import LazyYouTube from "./LazyYouTube";

export default function Clips() {
    return (
        <div className="w-full p-6 h-full">
            <h1 className="text-white drop-shadow-2xl text-center text-6xl md:text-8xl">
                Clips
            </h1>
            {/* Mobile: 4x1 vertical grid, Desktop: 2x2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-6xl mx-auto">
                <LazyYouTube
                    videoId="ttFH35JEoKM"
                    title="East Bay Regionals Qualification 61 Robot POV"
                />
                <LazyYouTube videoId="fEniKa6NIQ8" title="SF Regionals Video" />
                <LazyYouTube
                    videoId="ViS3LYWoiY8"
                    title="SF Regionals Qualification 76"
                />
                <LazyYouTube
                    videoId="X94HLZau0W4"
                    title="SF Regionals Match 6 Robot POV"
                />
            </div>
        </div>
    );
}
