import { useState, useEffect } from "react";

interface TypewriterEffectProps {
    words: { text: string }[];
    speed?: number; // milliseconds between characters
    delay?: number; // delay before starting
    className?: string;
}

export function TypewriterEffect({
    words,
    speed = 50,
    delay = 0,
    className = "",
}: TypewriterEffectProps) {
    const [displayText, setDisplayText] = useState("");
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);

    // Combine all words into one string with spaces
    const fullText = words.map((word) => word.text).join(" ");

    useEffect(() => {
        if (currentCharIndex >= fullText.length) return;

        const timer = setTimeout(
            () => {
                setDisplayText(fullText.slice(0, currentCharIndex + 1));
                setCurrentCharIndex((prev) => prev + 1);
            },
            currentCharIndex === 0 ? delay : speed
        );

        return () => clearTimeout(timer);
    }, [currentCharIndex, fullText, speed, delay]);

    return (
        <span
            className={className}
            style={{
                fontSize: "inherit",
                fontFamily: "inherit",
                fontWeight: "inherit",
                lineHeight: "inherit",
                color: "inherit",
                letterSpacing: "inherit",
            }}
        >
            {displayText}
        </span>
    );
}
