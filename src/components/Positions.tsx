import React, { useEffect, useRef, useState } from "react";
import Position from "./Position";

export default function Positions() {
    return (
        <div className="w-full p-6 h-full">
            <h1 className="text-white drop-shadow-2xl text-center text-6xl md:text-8xl">
                Our Open Positions
            </h1>
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
        </div>
    );
}
