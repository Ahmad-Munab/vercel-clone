"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader } from "lucide-react"; // Import icons from Lucide React Icons
import { toast } from "sonner";

// Function to validate a URL
export function isValidUrl(url) {
    try {
        new URL(url);
        const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/?$/);
        if (!match || match.length < 3) {
            return false, "Can't access GitHub repository URL (Maybe Private)";
        }
        return [true, "Valid GitHub URL"];
    } catch (error) {
        return [false, "Please enter a valid URL"];
    }
}

export async function fetchRepoInfo(url) {
    // Extract owner and repo name from the GitHub URL
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/?$/);
    if (!match || match.length < 3) {
        throw new Error("Invalid GitHub repository URL");
    }

    const owner = match[1];
    const repoName = match[2];

    const apiUrl = `https://api.github.com/repos/${owner}/${repoName}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch repository information");
        }

        const data = await response.json();

        // Check if the repository exists and is not archived
        const isValid = data && !data.archived;

        return { isValid };
    } catch (error) {
        console.error("Error fetching repository info:", error);
        throw new Error("Error fetching repository information");
    }
}

export default function DeployContainer() {
    const [repoUrl, setRepoUrl] = useState("");
    const [fetching, setFetching] = useState(false);
    const [validRepo, setValidRepo] = useState(false);
    const [fetchTimeout, setFetchTimeout] = useState(null);

    const handleUrlChange = (event) => {
        const url = event.target.value;
        setRepoUrl(url);

        // Clear previous timeout
        if (fetchTimeout) {
            clearTimeout(fetchTimeout);
        }

        // Set new timeout to fetch repository info after 0.5 seconds
        const timeoutId = setTimeout(() => {
            // Validate URL
            const [valid] = isValidUrl(url);
            if (valid) {
                setFetching(true);
                fetchRepoInfo(url)
                    .then((response) => {
                        // Check if response indicates a valid repository
                        if (response.isValid) {
                            setValidRepo(true);
                        } else {
                            setValidRepo(false);
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching repository info:", error);
                        setValidRepo(false);
                    })
                    .finally(() => {
                        setFetching(false);
                    });
            } else {
                setValidRepo(false);
            }
        }, 500);

        // Update fetchTimeout state with the new timeout id
        setFetchTimeout(timeoutId);
    };

    const handleDeploy = () => {
        const [valid, msg] = isValidUrl(repoUrl);
        // console.log(valid, msg);
        if (!valid) {
            toast.warning(msg);
            return;
        }
        if (!validRepo) {
            toast.warning("Can't access repository (Maybe Private)");
        }

        return;
    };

    return (
        <div className="flex items-center min-h-screen w-full py-20 px-4 flex-col gap-4 md:px-6">
            <div className=" w-full max-w-lg flex flex-col items-center gap-8 text-center rounded-lg border border-gray-200 p-6 dark:border-gray-800 relative">
                <h1 className="text-3xl font-bold">Deploy your project</h1>
                <p className="text-gray-500 dark:text-gray-400 ">
                    Import code from GitHub <br /> And Make sure this repository
                    is public
                </p>
                <div className="flex flex-col w-full gap-2 relative">
                    <Input
                        className="w-full pr-10" // Add padding for the icon
                        placeholder="https://github.com/your/repository"
                        type="url"
                        value={repoUrl}
                        onChange={handleUrlChange}
                    />
                    <p className="text-gray-500 dark:text-gray-400"></p>
                    <div className="absolute top-5 transform -translate-y-1/2 right-3">
                        {" "}
                        {/* Position the icons absolutely */}
                        {fetching && (
                            <Loader size={24} strokeWidth={2} color="#374151" />
                        )}
                        {validRepo && !fetching && (
                            <CheckCircle
                                size={24}
                                strokeWidth={2}
                                color="#10B981"
                            />
                        )}
                        {!validRepo && !fetching && repoUrl !== "" && (
                            <XCircle
                                size={24}
                                strokeWidth={2}
                                color="#EF4444"
                            />
                        )}
                    </div>
                    <Button
                        // disabled={!validRepo}
                        className="w-full mt-4"
                        onClick={handleDeploy}
                    >
                        Deploy
                    </Button>
                </div>
            </div>
        </div>
    );
}
