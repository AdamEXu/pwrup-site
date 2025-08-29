import NavBar from "./NavBar";
import { useLenis } from "../hooks/useLenis";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import { TypewriterEffect } from "./ui/simple-typewriter";
import BackgroundVideo from "./BackgroundVideo";

const words = [
    {
        text: "We",
    },
    {
        text: "are",
    },
    {
        text: "Pinewood",
    },
    {
        text: "Robotics",
    },
];

export default function Welcome() {
    useLenis();
    return (
        <main>
            <BackgroundVideo />
            <div id="container" className="min-h-screen relative z-10">
                <NavBar />
                <div id="content">
                    <div
                        id="headerslide"
                        className="flex justify-center h-screen items-center"
                    >
                        <h1
                            className="text-white drop-shadow-2xl text-center"
                            style={{ fontSize: "6.9vw" }}
                        >
                            {/* We are Pinewood Robotics */}
                            <TypewriterEffect words={words} />
                        </h1>
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
