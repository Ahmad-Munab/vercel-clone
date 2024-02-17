// Function to validate a URL
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
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
