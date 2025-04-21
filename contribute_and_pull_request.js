const axios = require('axios');
const simpleGit = require('simple-git');
require('dotenv').config();

const git = simpleGit();

// GitHub Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO_OWNER = 'Elmahrosa';
const REPO_NAME = 'salma-unity-care-hospital';
const BASE_BRANCH = 'main'; // Default branch
const CONTRIBUTOR_BRANCH = 'feature/contribution-branch';

// Utility to make authenticated GitHub API requests
const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

// Create a branch, make changes, and push to GitHub
async function makeContribution() {
  try {
    console.log('Fetching repository...');
    await git.clone(`https://github.com/${REPO_OWNER}/${REPO_NAME}.git`);
    process.chdir(REPO_NAME);

    console.log('Creating a new branch...');
    await git.checkoutBranch(CONTRIBUTOR_BRANCH, BASE_BRANCH);

    console.log('Adding a contribution...');
    const fs = require('fs');
    const newFileContent = `// Example contribution script
console.log('This is a contribution to the salma-unity-care-hospital repository.');
`;
    const fileName = 'contribution-script.js';
    fs.writeFileSync(fileName, newFileContent);

    console.log('Staging and committing changes...');
    await git.add(fileName);
    await git.commit('Added example contribution script');

    console.log('Pushing changes to the remote repository...');
    await git.push('origin', CONTRIBUTOR_BRANCH);

    console.log('Creating a pull request...');
    const pullRequest = await githubApi.post(
      `/repos/${REPO_OWNER}/${REPO_NAME}/pulls`,
      {
        title: 'Example Contribution: Added contribution script',
        head: CONTRIBUTOR_BRANCH,
        base: BASE_BRANCH,
        body: 'This pull request adds an example contribution script.',
      }
    );

    console.log(`Pull request created: ${pullRequest.data.html_url}`);
  } catch (error) {
    console.error('Error during the contribution process:', error.response?.data || error.message);
  }
}

// Start the contribution process
makeContribution();
