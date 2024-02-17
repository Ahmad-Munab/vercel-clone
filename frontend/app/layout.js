import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "ParcelJS || A Vercel Clone By Ahmad Munab",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <html lang="en">
                <body
                    className={cn(inter.className, "h-screen w-screen p-0 m-0")}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Toaster position="top-center" />
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}