import React, { useState, useEffect, useRef, lazy, Suspense } from "react";

// Lazy load the CanvasRevealEffect to reduce initial bundle size
const CanvasRevealEffect = lazy(() =>
    import("./ui/canvas-reveal-effect").then((module) => ({
        default: module.CanvasRevealEffect,
    }))
);

interface FancyButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export default function FancyButton({
    children,
    onClick,
    className = "",
    disabled = false,
    type = "button",
}: FancyButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [showEffect, setShowEffect] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [revealCenter, setRevealCenter] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [animationSpeed, setAnimationSpeed] = useState(0.8);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Calculate animation speed based on button width
    const calculateAnimationSpeed = (width: number) => {
        // Base: 1.0 at 400px width
        // Scale factor: width / 400
        // Cap between 0.5 (minimum) and 10 (maximum for ultrawide)
        const scaleFactor = (width / 400) * 2;
        return Math.max(1, Math.min(30, scaleFactor));
    };

    useEffect(() => {
        if (isHovered) {
            // Clear any existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setIsAnimatingOut(false);
            setShowEffect(true);
        } else if (showEffect) {
            // Start reverse animation only if effect is currently showing
            setIsAnimatingOut(true);
            // Hide effect after fade-out completes (500ms transition + small buffer)
            timeoutRef.current = setTimeout(() => {
                setShowEffect(false);
                setIsAnimatingOut(false);
            }, 250);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isHovered]);
    return (
        <button
            ref={buttonRef}
            type={type}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={(e) => {
                // Calculate cursor position relative to button
                if (buttonRef.current) {
                    const rect = buttonRef.current.getBoundingClientRect();
                    const relativeX = e.clientX - rect.left;
                    const relativeY = e.clientY - rect.top;

                    // Convert to shader coordinate system:
                    // 1. Scale by 2 (shader uses doubled resolution)
                    // 2. Flip Y coordinate (shader flips Y)
                    const x = relativeX * 2;
                    const y = relativeY * 2;

                    setRevealCenter({ x, y });

                    // Calculate and set animation speed based on button width
                    const speed = calculateAnimationSpeed(rect.width);
                    setAnimationSpeed(speed);
                }
                setIsHovered(true);
            }}
            onMouseLeave={() => setIsHovered(false)}
            className={`group p-4 border-2 border-white relative box-border bg-black/50 hover:bg-black/80 backdrop-blur-sm hover:backdrop-blur-md ${className}`}
            style={{
                boxShadow:
                    "0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.6)",
                transition:
                    "background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease",
            }}
        >
            {/* Canvas Reveal Effect - visible during hover and exit animation */}
            {(showEffect || isHovered) && (
                <div
                    className={`absolute inset-0 pointer-events-none transition-opacity duration-500 overflow-hidden ${
                        isAnimatingOut ? "opacity-0" : "opacity-100"
                    }`}
                >
                    <Suspense fallback={<div />}>
                        <CanvasRevealEffect
                            animationSpeed={animationSpeed}
                            containerClassName="bg-transparent"
                            colors={[[112, 205, 53]]} // brand-lime-green in RGB
                            dotSize={2}
                            showGradient={false}
                            revealCenter={revealCenter || undefined}
                        />
                    </Suspense>
                </div>
            )}
            <span className="text-[#70cd35] relative z-10">{children}</span>

            {/* Top-left corner */}
            <span className="h-0.5 w-2 bg-[#70cd35] absolute block -top-0.5 -left-2 group-hover:-left-0.5 transition-all z-10"></span>
            <span className="h-2 w-0.5 bg-[#70cd35] absolute block -top-2 -left-0.5 group-hover:-top-0.5 transition-all z-10"></span>

            {/* Bottom-left corner */}
            <span className="h-0.5 w-2 bg-[#70cd35] absolute block -bottom-0.5 -left-2 group-hover:-left-0.5 transition-all z-10"></span>
            <span className="h-2 w-0.5 bg-[#70cd35] absolute block -bottom-2 -left-0.5 group-hover:-bottom-0.5 transition-all z-10"></span>

            {/* Bottom-right corner */}
            <span className="h-0.5 w-2 bg-[#70cd35] absolute block -bottom-0.5 -right-2 group-hover:-right-0.5 transition-all z-10"></span>
            <span className="h-2 w-0.5 bg-[#70cd35] absolute block -bottom-2 -right-0.5 group-hover:-bottom-0.5 transition-all z-10"></span>

            {/* Top-right corner */}
            <span className="h-0.5 w-2 bg-[#70cd35] absolute block -top-0.5 -right-2 group-hover:-right-0.5 transition-all z-10"></span>
            <span className="h-2 w-0.5 bg-[#70cd35] absolute block -top-2 -right-0.5 group-hover:-top-0.5 transition-all z-10"></span>
        </button>
    );
}
