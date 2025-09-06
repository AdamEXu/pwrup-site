import NavBar from "./NavBar";
import { useLenis } from "../hooks/useLenis";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { TypewriterEffect } from "./ui/simple-typewriter";
import BackgroundVideo from "./BackgroundVideo";
import FancyButton from "./FancyButton";
import { useState, useEffect, useRef } from "react";

const words = [
    {
        text: "We",
    },
    {
        text: "are",
    },
];

// Configuration for the reveal animation
const REVEAL_CONFIG = {
    textAlign: "right" as "left" | "center" | "right", // Change this to control animation direction
    text: "Pinewood Robotics",
};

export default function Welcome() {
    useLenis();
    const [typewriterComplete, setTypewriterComplete] = useState(false);
    const [animationStarted, setAnimationStarted] = useState(false);
    const pinewoodRef = useRef<HTMLDivElement>(null);

    // Start width reveal animation when typewriter completes
    useEffect(() => {
        if (typewriterComplete && !animationStarted) {
            setAnimationStarted(true);

            // Small delay before starting the reveal animation
            setTimeout(() => {
                if (pinewoodRef.current) {
                    // Get the natural width first by temporarily setting width to auto
                    pinewoodRef.current.style.width = "auto";
                    const fullWidth = pinewoodRef.current.offsetWidth;
                    pinewoodRef.current.style.width = "0";

                    // Force a reflow to ensure the width: 0 is applied
                    pinewoodRef.current.offsetHeight;

                    // Set transition and force another reflow
                    pinewoodRef.current.style.transition =
                        "width 1000ms ease-out";
                    pinewoodRef.current.offsetHeight; // Force reflow

                    // Use a small delay to ensure transition is ready, then animate
                    setTimeout(() => {
                        if (pinewoodRef.current) {
                            pinewoodRef.current.style.width = `${fullWidth}px`;

                            // Set back to auto after animation completes (1000ms)
                            setTimeout(() => {
                                if (pinewoodRef.current) {
                                    pinewoodRef.current.style.width = "auto";
                                    // Remove width transition so text can resize instantly
                                    pinewoodRef.current.style.transition =
                                        "none";
                                }
                            }, 1000);
                        }
                    }, 50); // Small delay to ensure transition is applied
                }
            }, 300);
        }
    }, [typewriterComplete, animationStarted]);

    return (
        <main>
            <BackgroundVideo />
            <div id="container" className="min-h-screen relative z-10">
                <div id="content">
                    <div
                        // id="headerslide"
                        className="flex justify-center h-screen items-center"
                    >
                        <div className="flex flex-col space-y-4 w-full">
                            <div
                                className="text-white drop-shadow-2xl text-center relative"
                                style={{ fontSize: "6.9vw" }}
                            >
                                {/* Container for the entire text */}
                                <div className="flex justify-center items-center min-h-[1.2em]">
                                    {/* "We are" - types out first */}
                                    <div>
                                        <TypewriterEffect
                                            words={words}
                                            onComplete={() =>
                                                setTypewriterComplete(true)
                                            }
                                        />
                                    </div>

                                    {/* "Pinewood Robotics" - starts with width 0, expands to reveal text */}
                                    <div
                                        ref={pinewoodRef}
                                        className="text-[#70cd35] overflow-hidden whitespace-nowrap ml-4"
                                        style={{
                                            width: "0",
                                            textShadow:
                                                "2px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 8px rgba(0, 0, 0, 0.2)",
                                            textAlign: "right",
                                            direction: "rtl", // Right-to-left text direction for right alignment
                                            fontWeight: 500,
                                        }}
                                    >
                                        <span style={{ direction: "ltr" }}>
                                            Pinewood Robotics
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center flex-col sm:flex-row gap-8 w-[50%] mx-auto">
                                <a href="/sign-up">
                                    <FancyButton className="w-full sm:w-[160px]">
                                        Sign Up
                                    </FancyButton>
                                </a>
                                {/* <a href="/blog">
                                    <FancyButton className="w-full sm:w-[160px]">
                                        Blog
                                    </FancyButton>
                                </a>
                                <FancyButton className="w-full sm:w-[160px]">
                                    Socials
                                </FancyButton> */}
                            </div>
                        </div>
                    </div>
                    <div
                        id="headerslide"
                        className="flex justify-center h-screen items-center"
                    >
                        {/* <div className="absolute w-full h-[100vh] top-[60vh] backdrop-blur-lg"></div> */}
                        <h1
                            className="text-white drop-shadow-2xl text-center"
                            style={{ fontSize: "6.9vw" }}
                        >
                            Another test
                            {/* <TypewriterEffectSmooth words={words} /> */}
                        </h1>
                    </div>
                </div>
            </div>
        </main>
    );
}
