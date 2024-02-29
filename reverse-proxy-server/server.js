const express = require("express");
const httpProxy = require("http-proxy");
require("dotenv").config();

const PORT = process.env.PORT || 80;
const GITHUB_PAGES_BASE = process.env.GITHUB_PAGES_BASE;
const app = express();

// Main reverse proxy
const proxy = httpProxy.createProxy();

proxy.on("proxyReq", (proxyReq, req, res) => {
    const url = req.url;
    if (url === "/") {
        proxyReq.path += "index.html";
    }
    return proxyReq;
});

// proxy.on("error", (proxyReq, req, res) => {});

app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split(".")[0];

    const resolvesTo = `${GITHUB_PAGES_BASE}/${subdomain}`;

    proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
});

function check() {
    if (process.env.GITHUB_PAGES_BASE) {
        return { safe_to_run: true };
    }
    return { err: "Environment variables not provided" };
}

if (check().safe_to_run) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://0.0.0.0:${PORT}`);
    });
} else {
    throw new Error(check().err);
}
