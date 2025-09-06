import { useState, useEffect } from "react";

interface TypewriterEffectProps {
    words: { text: string; className?: string }[];
    speed?: number; // milliseconds between characters
    delay?: number; // delay before starting
    className?: string;
    jitter?: number; // percentage of speed variation (0-100)
    onComplete?: () => void; // callback when all words are typed
}

export function TypewriterEffect({
    words,
    speed = 100,
    delay = 0,
    className = "",
    jitter = 20,
    onComplete,
}: TypewriterEffectProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [displayedWords, setDisplayedWords] = useState<
        { text: string; className?: string; isComplete: boolean }[]
    >([]);

    useEffect(() => {
        if (currentWordIndex >= words.length) {
            // All words are complete, trigger callback
            if (onComplete) {
                onComplete();
            }
            return;
        }

        const currentWord = words[currentWordIndex];
        const timer = setTimeout(
            () => {
                if (currentCharIndex < currentWord.text.length) {
                    // Still typing current word
                    setDisplayedWords((prev) => {
                        const newWords = [...prev];
                        if (newWords[currentWordIndex]) {
                            newWords[currentWordIndex] = {
                                ...currentWord,
                                text: currentWord.text.slice(
                                    0,
                                    currentCharIndex + 1
                                ),
                                isComplete: false,
                            };
                        } else {
                            newWords[currentWordIndex] = {
                                ...currentWord,
                                text: currentWord.text.slice(
                                    0,
                                    currentCharIndex + 1
                                ),
                                isComplete: false,
                            };
                        }
                        return newWords;
                    });
                    setCurrentCharIndex((prev) => prev + 1);
                } else {
                    // Finished current word, move to next
                    setDisplayedWords((prev) => {
                        const newWords = [...prev];
                        newWords[currentWordIndex] = {
                            ...currentWord,
                            text: currentWord.text,
                            isComplete: true,
                        };
                        return newWords;
                    });
                    setCurrentWordIndex((prev) => prev + 1);
                    setCurrentCharIndex(0);
                }
            },
            currentCharIndex === 0 && currentWordIndex === 0
                ? delay
                : speed + (Math.random() - 0.5) * 2 * ((speed * jitter) / 100)
        );

        return () => clearTimeout(timer);
    }, [currentWordIndex, currentCharIndex, words, speed, delay, jitter]);

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
                textShadow:
                    "2px 2px 4px rgba(0, 0, 0, 0.4), 0px 0px 8px rgba(0, 0, 0, 0.2)",
            }}
        >
            {displayedWords.map((word, index) => (
                <span key={index}>
                    <span className={word.className || ""}>{word.text}</span>
                    {index < displayedWords.length - 1 &&
                        word.isComplete &&
                        " "}
                </span>
            ))}
        </span>
    );
}
