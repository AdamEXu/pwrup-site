import React, { useEffect, useRef, useState } from "react";

export default function AboutRobotics() {
    return (
        <div className="w-full p-6">
            <h1 className="text-white drop-shadow-2xl text-center text-6xl md:text-8xl">
                Why join robotics?
            </h1>
            <div className="flex flex-col lg:flex-row gap-8 mt-10">
                <div className="text-white drop-shadow-2xl text-center text-2xl w-full lg:w-1/2">
                    <p
                        className="text-3xl md:text-4xl text-left"
                        style={{ fontWeight: 300, lineHeight: 1.5 }}
                    >
                        <span>
                            We are a team of students from Pinewood School, and
                            we have{" "}
                        </span>
                        <span>a lot of fun</span>
                        <span>
                            {" "}
                            building robots and competing against other teams in
                            FRC competitions.
                        </span>
                    </p>
                    <p
                        className="text-3xl md:text-4xl text-left mt-4"
                        style={{ fontWeight: 500, lineHeight: 1.5 }}
                    >
                        Robotics is:
                    </p>
                    <ul
                        className="list-disc list-inside text-left mt-4 pl-4 text-2xl"
                        style={{
                            lineHeight: 1.5,
                        }}
                    >
                        <li
                            className="hover:text-[#70cd35] hover:translate-x-2"
                            style={{
                                transition:
                                    "color 0.2s ease, transform 0.2s ease",
                            }}
                        >
                            Fun
                        </li>
                        <li
                            className="hover:text-[#70cd35] hover:translate-x-2"
                            style={{
                                transition:
                                    "color 0.2s ease, transform 0.2s ease",
                            }}
                        >
                            Challenging
                        </li>
                        <li
                            className="hover:text-[#70cd35] hover:translate-x-2"
                            style={{
                                transition:
                                    "color 0.2s ease, transform 0.2s ease",
                            }}
                        >
                            Competitive
                        </li>
                        <li
                            className="hover:text-[#70cd35] hover:translate-x-2"
                            style={{
                                transition:
                                    "color 0.2s ease, transform 0.2s ease",
                            }}
                        >
                            Collaborative
                        </li>
                        <li
                            className="hover:text-[#70cd35] hover:translate-x-2"
                            style={{
                                transition:
                                    "color 0.2s ease, transform 0.2s ease",
                            }}
                        >
                            Flexible
                        </li>
                    </ul>
                </div>
                <div className="text-white drop-shadow-2xl text-center text-2xl w-full lg:w-1/2 mx-auto lg:mx-0 h-full">
                    <img
                        src="/Reefscape-Robot.png"
                        alt="Robotics"
                        style={{
                            maxHeight: "500px",
                            width: "auto",
                            margin: "auto",
                            objectFit: "contain",
                        }}
                    />
                    <div>
                        <p
                            style={{
                                textAlign: "left",
                                marginTop: "30px",
                            }}
                        >
                            We built this robot!
                        </p>
                        <img
                            src="/Hand_Drawn_Arrow.svg"
                            alt="Arrow"
                            style={{
                                position: "relative",
                                top: -73,
                                left: 204,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
