import React, { useEffect, useRef } from "react";

export default function PEARL() {
    return (
        <div className="w-full p-6 h-full mt-8">
            <h1 className="text-white drop-shadow-2xl text-center text-6xl md:text-8xl">
                The PEARL
            </h1>
            <p className="text-white drop-shadow-2xl text-center text-2xl mt-8">
                PEARL stands for Pinewood Engineering and Robotics Laboratory.
            </p>
            <div className="flex flex-col lg:flex-row gap-8 mt-10">
                <div className="text-white drop-shadow-2xl text-center text-2xl w-full lg:w-1/2">
                    <img
                        src="/PEARL_1.jpeg"
                        alt="PEARL"
                        className="w-full h-auto"
                    />
                </div>
                <div className="text-white drop-shadow-2xl text-center text-2xl w-full lg:w-1/2">
                    <img
                        src="/PEARL_2.jpeg"
                        alt="PEARL"
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </div>
    );
}
