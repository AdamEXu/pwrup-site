import React from "react";

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
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`group p-4 border-2 border-white relative box-border bg-black/50 hover:bg-black/80 backdrop-blur-sm hover:backdrop-blur-md ${className}`}
            style={{
                boxShadow:
                    "0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.6)",
                transition:
                    "background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease",
            }}
        >
            <span className="text-[#70cd35]">{children}</span>

            {/* Top-left corner */}
            <span className="h-0.5 w-2 bg-[#70cd35] absolute block -top-0.5 -left-2 group-hover:-left-0.5 transition-all"></span>
            <span className="h-2 w-0.5 bg-[#70cd35] absolute block -top-2 -left-0.5 group-hover:-top-0.5 transition-all"></span>

            {/* Bottom-left corner */}
            <span className="h-0.5 w-2 bg-[#70cd35] absolute block -bottom-0.5 -left-2 group-hover:-left-0.5 transition-all"></span>
            <span className="h-2 w-0.5 bg-[#70cd35] absolute block -bottom-2 -left-0.5 group-hover:-bottom-0.5 transition-all"></span>

            {/* Bottom-right corner */}
            <span className="h-0.5 w-2 bg-[#70cd35] absolute block -bottom-0.5 -right-2 group-hover:-right-0.5 transition-all"></span>
            <span className="h-2 w-0.5 bg-[#70cd35] absolute block -bottom-2 -right-0.5 group-hover:-bottom-0.5 transition-all"></span>

            {/* Top-right corner */}
            <span className="h-0.5 w-2 bg-[#70cd35] absolute block -top-0.5 -right-2 group-hover:-right-0.5 transition-all"></span>
            <span className="h-2 w-0.5 bg-[#70cd35] absolute block -top-2 -right-0.5 group-hover:-top-0.5 transition-all"></span>
        </button>
    );
}
