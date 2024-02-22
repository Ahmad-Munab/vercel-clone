const { deleteFolder, getBuildScript } = require("../utils/buildUtils");
const { createAndPushRepo, pushToGHPages } = require("../utils/githubUtils");

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const deployRepo = async (req, res) => {
  let cloneDir;

  const respond = (res_status, res_json) => {
    deleteFolder(cloneDir);
    console.log(`Status: ${res_status}/n Data: ${res_json}`);
    res.status(res_status).json(res_json);
  };

  const { repo_url } = req.body;
  if (!repo_url) {
    return respond(400, { error: "Missing repo_url in request body" });
  }

  const baseDir = "/app";
  process.chdir(baseDir);

  try {
    const repoName = repo_url.split("/").pop().replace(".git", "");
    const randomSuffix = uuidv4().substr(0, 2);
    const newRepoName = `${repoName}-${randomSuffix}`;
    cloneDir = path.join("/app", "repos", repoName);

    console.log(`Cloning repository: ${repoName}`);
    exec(
      `git clone ${repo_url} ${cloneDir}`,
      async (cloneErr, stdout, stderr) => {
        if (cloneErr) {
          return respond(500, {
            message: `Error cloning repository: ${cloneDir}`,
          });
        }

        process.chdir(cloneDir);
        let [buildScript, buildScriptErr] = await getBuildScript();
        if (buildScriptErr !== null) {
          return respond(400, { message: err });
        }

        console.log("Installing packages..");
        exec("npm install", async (installingErr, buildStdout, buildStderr) => {
          if (installingErr) {
            return respond(500, { message: "Error installing packages" });
          }

          console.log("Building project...");
          exec(buildScript, async (buildErr, buildStdout, buildStderr) => {
            if (buildErr) {
              return respond(500, {
                message: `Error building project ${buildErr}`,
              });
            }

            let buildOutputDir = "build";
            if (!fs.existsSync(buildOutputDir)) {
              return respond(500, {
                message: `Build output directory does not exist`,
              });
            }

            console.log("Creating repository..");
            const [newRepoURL, repoErr] = await createAndPushRepo(
              newRepoName,
              buildOutputDir
            );
            if (repoErr !== null) {
              return respond(500, { message: err });
            }

            console.log("Publishing to GitHub Pages..");
            const [ghPagesURL, ghPagesErr] = await pushToGHPages(newRepoName);
            if (ghPagesErr !== null) {
              return respond(500, { message: err });
            }

            respond(200, {
              repo_name: newRepoName,
              repo_url: newRepoURL,
              gh_pages_url: ghPagesURL,
              status: "Deploying",
            });
          });
        });
      }
    );
  } catch (err) {
    console.error(err);
    return respond(500);
  }
};

module.exports = { deployRepo };
