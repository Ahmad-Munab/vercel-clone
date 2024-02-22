const { v4: uuidv4 } = require("uuid");
(async () => {
    const fetchModule = await import("node-fetch");
    const fetch = fetchModule.default;
})();
const simpleGit = require("simple-git");
const { exec } = require("child_process");

// import fetch from 'node-fetch';
require("dotenv").config();

const username = process.env.GITHUB_USERNAME;
const token = process.env.GITHUB_TOKEN;

const createRepository = async (repoName) => {
    const apiUrl = `https://api.github.com/user/repos`;
    const requestBody = {
        name: repoName,
        private: false,
    };

    const headers = {
        "Content-Type": "application/json",
        Authorization: `token ${token}`,
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            const newRepoURL = `https://github.com/${username}/${repoName}`;
            console.log(`Repository ${newRepoURL} created successfully.`);
            console.log("Pushing static assets..");
            process.chdir("test-build");

            const git = simpleGit();
            await git.init();

            await git.addRemote("origin", `${newRepoURL}.git`);
            exec(
                `git remote set-url origin https://${username}:${token}@github.com/${username}/${newRepoName}.git`
            );
            await git.add(".");
            await git.commit("Initial commit");

            await git.push(["-u", "origin", "master"]);

            return [newRepoURL, null];
        } else {
            console.error(
                `Failed to create repository. Status: ${response.status}`
            );
            return [
                null,
                `Failed to create repository. Status: ${response.status}`,
            ];
        }
    } catch (error) {
        console.error("Error creating repository:", error);
        return [null, "Error creating repository"];
    }
};

async function createGitHubPages(repoName) {
    const apiUrl = `https://api.github.com/repos/${username}/${repoName}/pages`;

    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.switcheroo-preview+json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            source: {
                branch: "master",
                path: "/",
            },
        }),
    };

    try {
        const response = await fetch(apiUrl, requestOptions);
        if (!response.ok) {
            throw new Error(
                `Failed to create GitHub Pages. Status: ${response.status}`
            );
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    }
}

const randomSuffix = uuidv4().substr(0, 8);
const newRepoName = `${"ghpages-test-repo-1"}-${randomSuffix}`;

console.log("Creating repository..");

(async () => {
    let [newRepoURL, err] = await createRepository(newRepoName);
    if (err !== null) {
        // deleteFolder(cloneDir);
        throw new Error(err);
        // return res.status(500).json({ error: err });
    }
    createGitHubPages(newRepoName);
})();
