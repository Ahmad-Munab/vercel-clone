const fs = require("fs");

const getBuildScript = async () => {
  const packageJsonPath = "./package.json";
  const packageJsonExists = fs.existsSync(packageJsonPath);

  if (!packageJsonExists) {
    const errMsg = "No package.json found. Unable to detect build script.";
    console.error(errMsg);
    return [null, errMsg]; // Return only the error message
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  if (!packageJson.scripts) {
    const errMsg =
      "No scripts defined in package.json. Unable to detect build script.";
    console.error(errMsg);
    return [null, errMsg]; // Return only the error message
  }

  // Check for common build script names
  const commonBuildScripts = ["build", "build:prod"];

  for (const scriptName of commonBuildScripts) {
    if (packageJson.scripts[scriptName]) {
      console.log(`Detected '${scriptName}' script in package.json.`);
      return [`npm run ${scriptName}`, null];
    }
  }

  const errMsg =
    "No standard build script found. Additional analysis may be required.";
  console.log(errMsg);
  return [null, errMsg]; // Return only the error message
};

const deleteFolder = (folderPath) => {
  try {
    fs.rmdirSync(folderPath, {
      recursive: true,
    });
  } catch (err) {
    console.error("Error:", err);
    return false;
  }

  return true;
};

module.exports = { getBuildScript, deleteFolder };
