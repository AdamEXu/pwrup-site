import React, { useEffect, useRef, useState } from "react";

export default function Clips() {
    return (
        <div className="w-full p-6 h-full">
            <h1 className="text-white drop-shadow-2xl text-center text-6xl md:text-8xl">
                Clips
            </h1>
            {/* Mobile: 4x1 vertical grid, Desktop: 2x2 grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-6xl mx-auto">
                <div className="aspect-video">
                    <iframe
                        src="https://www.youtube.com/embed/ttFH35JEoKM"
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="aspect-video">
                    <iframe
                        src="https://www.youtube.com/embed/fEniKa6NIQ8"
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="aspect-video">
                    <iframe
                        src="https://www.youtube.com/embed/ViS3LYWoiY8"
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <div className="aspect-video">
                    <iframe
                        src="https://www.youtube.com/embed/X94HLZau0W4"
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
