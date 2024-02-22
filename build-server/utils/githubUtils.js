const { exec } = require("child_process");
(async () => {
  const fetchModule = await import("node-fetch");
  const fetch = fetchModule.default;
})();
const simpleGit = require("simple-git");

require("dotenv").config();

const username = process.env.GITHUB_USERNAME;
const token = process.env.GITHUB_TOKEN;

const createAndPushRepo = async (repoName, buildDir) => {
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
      process.chdir(buildDir);

      const git = simpleGit();
      await git.init();
      await git.addRemote("origin", `${newRepoURL}.git`);
      exec(
        `git remote set-url origin https://${username}:${token}@github.com/${username}/${repoName}.git`
      );
      await git.add(".");
      await git.commit("Initial commit");
      await git.push(["-u", "origin", "master"]);

      return [newRepoURL, null];
    } else {
      console.error(`Failed to create repository. Status: ${response.status}`);
      return [null, `Failed to create repository. Status: ${response.status}`];
    }
  } catch (error) {
    console.error("Error creating repository:", error);
    return [null, "Error creating repository"];
  }
};

const pushToGHPages = async (repoName) => {
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
      console.error(
        `Failed to create GitHub Pages. Status: ${response.status}`
      );
      return [
        null,
        `Failed to create GitHub Pages. Status: ${response.status}`,
      ];
    }
    const data = await response.json();
    console.log(data);
    return [data.html_url, null];
  } catch (error) {
    console.error("Error:", error);
    return [null, `Error: ${error?.message}`];
  }
};

module.exports = { createAndPushRepo, pushToGHPages };
