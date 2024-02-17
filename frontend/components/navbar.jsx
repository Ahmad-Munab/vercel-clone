"use client";

import { cn } from "@/lib/utils";

import { Montserrat } from "next/font/google";
import Link from "next/link";
import React from "react";
import AuthBox from "./auth-box";
import Image from "next/image";

const font = Montserrat({
    weight: "800",
    subsets: ["latin"],
});

const Navabar = () => {
    return (
        <nav className="py-4 md:px-0 px-4  bg-transparent flex items-center justify-start gap-6 xl:mx-[17%] md:mx-[7%] mx-2">
            <div className="flex items-center gap-x-2">
                <Link
                    href="/"
                    className={cn(
                        "md:text-4xl text-3xl text-black/90 dark:text-white/90 flex",
                        font.className
                    )}
                >
                    <Image
                        src={"/icons/node-js.png"}
                        alt=""
                        width={40}
                        height={40}
                        className="mr-3"
                    />
                    <span>Parcel</span>
                    <span className="text-[#8BC64A]">JS</span>
                </Link>
            </div>
            <AuthBox />
        </nav>
    );
};

export default Navabar;
