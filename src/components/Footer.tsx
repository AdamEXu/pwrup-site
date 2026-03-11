import React, { useEffect, useRef, useState } from "react";

export default function Footer() {
    return (
        <div className="bg-black/30 p-6 backdrop-blur-lg mt-8">
            <p className="text-white text-center mt-4">Email us: <a className="text-[#70cd35] underline" href="mailto:robotics@pinewood.edu">robotics@pinewood.edu</a></p>
            <p className="text-white text-center mt-4">The Blue Alliance: <a className="text-[#70cd35] underline" href="https://www.thebluealliance.com/team/4765">Team 4765</a></p>
            <p className="text-white text-center mt-4">GitHub: <a className="text-[#70cd35] underline" href="https://www.github.com/PinewoodRobotics">@PinewoodRobotics</a></p>
            <p className="text-white text-center mt-4">Youtube: <a className="text-[#70cd35] underline" href="https://www.youtube.com/@pinewoodrobotics">@pinewoodrobotics</a></p>
            <p className="text-white text-center mt-4">
                &copy; {new Date().getFullYear()} Pinewood Robotics. All rights
                reserved.
            </p>
        </div>
    );
}
