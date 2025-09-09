import React, { useEffect, useRef, useState } from "react";

export default function Position() {
    return (
        <div className="flex flex-col lg:flex-row gap-8 my-16 text-white">
            <div className="w-full lg:w-1/2">
                <h2 className="text-4xl md:text-6xl text-left mb-4">
                    Business
                </h2>
                <p
                    className="text-2xl md:text-3xl text-left"
                    style={{ lineHeight: 1.5 }}
                >
                    We are recruiting a business leader to manage our finances,
                    as well as sponsor outreach. You will also be tasked with
                    planning competition logistics.
                </p>
                <p className="text-2xl md:text-3xl text-left mt-4">
                    <b>Responsibilities:</b>
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
                            transition: "color 0.2s ease, transform 0.2s ease",
                        }}
                    >
                        Manage our finances and budgeting
                    </li>
                    <li
                        className="hover:text-[#70cd35] hover:translate-x-2"
                        style={{
                            transition: "color 0.2s ease, transform 0.2s ease",
                        }}
                    >
                        Plan and execute sponsor outreach
                    </li>
                    <li
                        className="hover:text-[#70cd35] hover:translate-x-2"
                        style={{
                            transition: "color 0.2s ease, transform 0.2s ease",
                        }}
                    >
                        Plan competition logistics
                    </li>
                </ul>
            </div>
            <div className="w-full lg:w-1/2">
                <img
                    src="/business_role.svg"
                    alt="A spreadsheet"
                    style={{
                        margin: "auto",
                        transform: `perspective(1000px) rotateY(-10deg) rotateX(${0}deg)`,
                        transformStyle: "preserve-3d",
                        width: "80%",
                        height: "auto",
                    }}
                />
            </div>
        </div>
    );
}
