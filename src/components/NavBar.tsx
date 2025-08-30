import { useState, useEffect } from "react";

export default function NavBar({
    isHomePage = false,
}: {
    isHomePage: boolean;
}) {
    const [isVisible, setIsVisible] = useState(!isHomePage);

    useEffect(() => {
        if (!isHomePage) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const halfWindowHeight = window.innerHeight * 0.6;
            const shouldShow = scrollY > halfWindowHeight;

            setIsVisible(shouldShow);
        };

        // Initial check
        handleScroll();

        // Listen to both native scroll and Lenis scroll events
        window.addEventListener("scroll", handleScroll);

        // Also listen to Lenis scroll events if available
        const checkLenis = () => {
            const lenis = (window as any).lenis;
            if (lenis) {
                lenis.on("scroll", handleScroll);

                return () => lenis.off("scroll", handleScroll);
            }
            return null;
        };

        // Try to attach Lenis listener immediately, or wait a bit for it to initialize
        let lenisCleanup = checkLenis();
        const lenisTimeout = setTimeout(() => {
            if (!lenisCleanup) {
                lenisCleanup = checkLenis();
            }
        }, 100);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (lenisCleanup) lenisCleanup();
            clearTimeout(lenisTimeout);
        };
    }, [isHomePage]);
    return (
        <div
            id="navbar"
            className="bg-black/20 fixed w-screen z-10 p-4 backdrop-blur-lg transition-transform duration-300 ease-in-out"
            style={{
                transform: isVisible ? "translateY(0)" : "translateY(-100%)",
                top: 0,
            }}
        >
            <div
                id="navcontainer"
                className="flex justify-between items-center"
            >
                <div id="navleft">
                    <a href="/">
                        <img
                            src="/PWRUP_text.svg"
                            alt="PWRUP"
                            className="h-4"
                        />
                    </a>
                </div>
                <div id="navright" className="flex space-x-6 items-center">
                    <a href="/blog" className="text-white">
                        Blog
                    </a>
                    <a href="/blog" className="text-white">
                        Socials
                    </a>
                </div>
            </div>
        </div>
    );
}
