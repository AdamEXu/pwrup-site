import NavBar from "./NavBar";
import { useLenis } from "../hooks/useLenis";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { TypewriterEffect } from "./ui/simple-typewriter";
import BackgroundVideo from "./BackgroundVideo";
import FancyButton from "./FancyButton";

const words = [
    {
        text: "We",
    },
    {
        text: "are",
    },
    {
        text: "Pinewood",
        className: "text-[#70cd35]",
    },
    {
        text: "Robotics",
        className: "text-[#70cd35]",
    },
];

export default function Welcome() {
    useLenis();
    return (
        <main>
            <BackgroundVideo />
            <div id="container" className="min-h-screen relative z-10">
                <div id="content">
                    <div
                        id="headerslide"
                        className="flex justify-center h-screen items-center"
                    >
                        <div className="flex flex-col space-y-4 w-full">
                            <h1
                                className="text-white drop-shadow-2xl text-center"
                                style={{ fontSize: "6.9vw" }}
                            >
                                {/* We are Pinewood Robotics */}
                                <TypewriterEffect words={words} />
                            </h1>
                            <div className="flex justify-center flex-col sm:flex-row gap-8 w-[50%] mx-auto">
                                <a href="#about">
                                    <FancyButton className="w-full sm:w-[160px]">
                                        About
                                    </FancyButton>
                                </a>
                                <a href="/blog">
                                    <FancyButton className="w-full sm:w-[160px]">
                                        Blog
                                    </FancyButton>
                                </a>
                                <FancyButton className="w-full sm:w-[160px]">
                                    Socials
                                </FancyButton>
                            </div>
                        </div>
                    </div>
                    <div
                        id="headerslide"
                        className="flex justify-center h-screen items-center"
                    >
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
