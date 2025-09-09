import React, { useEffect, useRef, useState } from "react";
import FancyButton from "./FancyButton";

export default function Position({
    title,
    description,
    responsibilities,
    requirements,
    image,
    direction = "left",
    id,
}: {
    title: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    image: string;
    direction?: "left" | "right";
    id?: string;
}) {
    const imageRef = useRef<HTMLImageElement>(null);
    const [verticalTilt, setVerticalTilt] = useState(0);
    const [isLargeScreen, setIsLargeScreen] = useState(true);

    useEffect(() => {
        const handleScrollAndResize = () => {
            // Check if screen is large (lg breakpoint is 1024px in Tailwind)
            setIsLargeScreen(window.innerWidth >= 1024);

            if (!imageRef.current) return;

            const rect = imageRef.current.getBoundingClientRect();
            const imageCenterY = rect.top + rect.height / 2;
            const screenCenterY = window.innerHeight / 2;

            // Calculate distance from screen center (-1 to 1)
            const distanceFromCenter =
                (imageCenterY - screenCenterY) / (window.innerHeight / 2);

            // Convert to tilt angle, capped at -15 to 15 degrees
            const tilt = Math.max(
                -15,
                Math.min(
                    15,
                    distanceFromCenter * 15 * (isLargeScreen ? 0.5 : 1)
                )
            );

            setVerticalTilt(tilt);
        };

        // Initial calculation
        handleScrollAndResize();

        // Add scroll and resize listeners
        window.addEventListener("scroll", handleScrollAndResize);
        window.addEventListener("resize", handleScrollAndResize);

        return () => {
            window.removeEventListener("scroll", handleScrollAndResize);
            window.removeEventListener("resize", handleScrollAndResize);
        };
    }, []);
    return (
        <div
            className={`flex flex-col ${
                direction === "left" ? "lg:flex-row" : "lg:flex-row-reverse"
            } gap-8 my-16 text-white`}
        >
            <div className="w-full lg:w-1/2">
                <h2 className="text-4xl md:text-6xl text-left mb-4">{title}</h2>
                <p
                    className="text-2xl md:text-3xl text-left"
                    style={{ lineHeight: 1.5 }}
                >
                    {description}
                </p>
                <p className="text-2xl md:text-3xl text-left mt-4">
                    <b>Responsibilities:</b>
                </p>
                <ul
                    className="list-disc list-inside text-left mt-4 pl-4 text-2xl"
                    style={{
                        lineHeight: 1.5,
                    }}
                >
                    {responsibilities.map((responsibility) => (
                        <li key={responsibility}>{responsibility}</li>
                    ))}
                </ul>
                <a
                    href={`/sign-up?role=${id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <FancyButton className="mt-8 w-full">Apply</FancyButton>
                </a>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                <img
                    ref={imageRef}
                    src={image}
                    alt="A spreadsheet"
                    style={{
                        margin: "auto",
                        transform: `perspective(1000px) rotateY(${
                            isLargeScreen
                                ? direction === "left"
                                    ? -10
                                    : 10
                                : 0
                        }deg) rotateX(${verticalTilt}deg)`,
                        transformStyle: "preserve-3d",
                        width: "80%",
                        height: "auto",
                    }}
                />
            </div>
        </div>
    );
}
