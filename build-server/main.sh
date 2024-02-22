#!/bin/bash

# Set GitHub credentials as environment variables
export GITHUB_USERNAME="$GITHUB_USERNAME"
export GITHUB_TOKEN="$GITHUB_TOKEN"
export GITHUB_NAME="$GITHUB_NAME"
export GITHUB_EMAIL="$GITHUB_EMAIL"

# Authenticate with GitHub using gh CLI
# gh auth login --with-token <<< $GITHUB_TOKEN

# Set Git credentials
# git config --global credential.helper store && \
#     echo "https://github.com:${GITHUB_USERNAME}:${GITHUB_TOKEN}" > ~/.git-credentials

git config --global user.email $GITHUB_EMAIL
git config --global user.name $GITHUB_NAME

# Run the script.js with Node.js
node server.js
