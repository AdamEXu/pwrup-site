import NavBar from "./NavBar";
import { useLenis } from "../hooks/useLenis";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { TypewriterEffect } from "./ui/simple-typewriter";
import BackgroundVideo from "./BackgroundVideo";
import FancyButton from "./FancyButton";
import { useState, useEffect, useRef } from "react";
import AboutRobotics from "./AboutRobotics";
import Positions from "./Positions";
import Clips from "./Clips";
import PEARL from "./PEARL";

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
    const [pinewoodAnimationStarted, setPinewoodAnimationStarted] =
        useState(false);
    const [textScale, setTextScale] = useState(1.5);
    const [weAreWidth, setWeAreWidth] = useState("auto");
    const [scrollHandlerEnabled, setScrollHandlerEnabled] = useState(false);
    const pinewoodRef = useRef<HTMLDivElement>(null);
    const weAreRef = useRef<HTMLDivElement>(null);

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
                            // Signal that the Pinewood animation is starting
                            setPinewoodAnimationStarted(true);

                            // Start scale animation at the same time
                            setTextScale(1);

                            pinewoodRef.current.style.width = `${fullWidth}px`;

                            // Set back to auto after animation completes (1000ms)
                            setTimeout(() => {
                                if (pinewoodRef.current) {
                                    pinewoodRef.current.style.width = "auto";
                                    // Remove width transition so text can resize instantly
                                    pinewoodRef.current.style.transition =
                                        "none";
                                }
                                // Enable scroll handler after initial animation completes
                                setScrollHandlerEnabled(true);
                            }, 1000);
                        }
                    }, 50); // Small delay to ensure transition is applied
                }
            }, 300);
        }
    }, [typewriterComplete, animationStarted]);

    // Scroll-based animation for "We are" text
    useEffect(() => {
        if (!scrollHandlerEnabled) {
            // Reset width to auto when scroll handler is disabled
            setWeAreWidth("auto");
            return;
        }

        // Ease-in-out function for smooth curve
        const easeInOut = (t: number) => {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        };

        const handleScroll = () => {
            if (!weAreRef.current) return;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Calculate linear scroll progress (0 to 1)
            const linearProgress = Math.min(scrollY / windowHeight, 1);

            // Apply easing curve for smoother animation
            const scrollProgress = easeInOut(linearProgress) * 4;

            // Get the natural width of "We are" text
            const tempStyle = weAreRef.current.style.width;
            weAreRef.current.style.width = "auto";
            const fullWidth = weAreRef.current.offsetWidth;
            weAreRef.current.style.width = tempStyle;

            // Calculate width: start at full width, go to 0
            const currentWidth = Math.max(fullWidth * (1 - scrollProgress), 0);
            setWeAreWidth(`${currentWidth}px`);

            // Calculate scale: start at 1, go to 1.5
            const currentScale = Math.min(1 + 0.5 * scrollProgress, 1.5);
            setTextScale(currentScale);
        };

        // Add scroll and resize listeners
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        // Initial calculation
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [scrollHandlerEnabled]);

    return (
        <main style={{ overflowX: "hidden" }}>
            <BackgroundVideo
                startFadeIn={pinewoodAnimationStarted}
                fadeMs={1000}
            />
            <div
                id="container"
                className="min-h-screen relative z-10"
                style={{ overflowX: "hidden" }}
            >
                <div id="content">
                    <div
                        // id="headerslide"
                        className="flex justify-center h-screen items-center"
                    >
                        <div className="flex flex-col space-y-4 w-full">
                            <div
                                className="text-white drop-shadow-2xl text-center relative"
                                style={{
                                    fontSize: "min(6.9vw, 120px)",
                                    transform: `scale(${textScale})`,
                                    transition: scrollHandlerEnabled
                                        ? "none"
                                        : "transform 1000ms ease-out",
                                    transformOrigin: "center",
                                }}
                            >
                                {/* Container for the entire text */}
                                <div className="flex justify-center items-center min-h-[1.2em]">
                                    {/* "We are" - types out first */}
                                    <div
                                        ref={weAreRef}
                                        className="overflow-hidden whitespace-nowrap"
                                        style={{
                                            width: weAreWidth,
                                        }}
                                    >
                                        <TypewriterEffect
                                            words={words}
                                            speed={100}
                                            jitter={0}
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
                                            textAlign: REVEAL_CONFIG.textAlign,
                                            direction:
                                                REVEAL_CONFIG.textAlign ===
                                                "right"
                                                    ? "rtl"
                                                    : "ltr",
                                            fontWeight: 500,
                                            // For center alignment, we need to position the text properly during animation
                                            ...(REVEAL_CONFIG.textAlign ===
                                                "center" && {
                                                display: "flex",
                                                justifyContent: "center",
                                                textAlign: "left", // Override to left for proper animation
                                                direction: "ltr", // Override to ltr for proper animation
                                            }),
                                        }}
                                    >
                                        <span style={{ direction: "ltr" }}>
                                            {REVEAL_CONFIG.text}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center flex-col sm:flex-row gap-8 w-[50%] mx-auto">
                                <a
                                    href="/sign-up"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <FancyButton className="w-full sm:w-[160px]">
                                        Register Interest
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
                    <AboutRobotics />
                    <Positions />
                    <Clips />
                    <PEARL />
                </div>
            </div>
        </main>
    );
}
