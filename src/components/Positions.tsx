import React, { useEffect, useRef, useState } from "react";
import Position from "./Position";

export default function Positions() {
    return (
        <div className="w-full p-6 h-full">
            <h1 className="text-white drop-shadow-2xl text-center text-6xl md:text-8xl">
                Our Open Positions
            </h1>
            <Position
                title="Marketing"
                description="We are recruiting a marketing leader to manage our social media presence, as well as recruitment of new members."
                responsibilities={[
                    "Manage our social media presence",
                    "Recruit new members",
                    "Plan and execute events",
                ]}
                requirements={[]}
                image="/marketing_role.svg"
                direction="right"
                id="marketing"
            />
            <Position
                title="Business"
                description="We are recruiting a business leader to manage our finances, as well as sponsor outreach. You will also be tasked with planning competition logistics."
                responsibilities={[
                    "Manage our finances and budgeting",
                    "Plan and execute sponsor outreach",
                    "Plan competition logistics",
                ]}
                requirements={[]}
                image="/business_role.svg"
                id="business"
            />
            <Position
                title="Software"
                description="We are recruiting software developers to work on our robot software. No coding experience is required, and anyone can join!"
                responsibilities={[
                    "Develop robot software",
                    "Debug software issues",
                    "Maintain robotics website",
                ]}
                requirements={[]}
                image="/marketing_role.svg"
                direction="right"
                id="software"
            />
            <Position
                title="Hardware"
                description="We are recruiting hardware engineers to work on our robot hardware. No prior experience is required, and anyone can join!"
                responsibilities={[
                    "Computer Aided Design (CAD)",
                    "Build and test robot hardware",
                    "Design and 3D print custom parts",
                ]}
                requirements={[]}
                image="/business_role.svg"
                id="business"
            />
        </div>
    );
}
