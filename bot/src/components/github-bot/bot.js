import { createAppAuth } from '@octokit/auth-app';
import { request } from '@octokit/request';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const bot = (installationId) => {
  const client = new Octokit({
    previews: ['machine-man-preview'],
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_IDENTIFIER,
      privateKey: process.env.PRIVATE_KEY,
      installationId
    },
    request: request.defaults({
      baseUrl: 'https://api.github.ibm.com',
    }),
    baseUrl: 'https://api.github.ibm.com',
  });
  return client
}

const createRef = (installationId, payload) => {
  const bot = new Octokit({
    previews: ['machine-man-preview'],
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_IDENTIFIER,
      privateKey: process.env.PRIVATE_KEY,
      installationId
    },
    request: request.defaults({
      baseUrl: 'https://api.github.ibm.com',
    }),
    baseUrl: 'https://api.github.ibm.com',
  });

  return bot.git.createRef(payload)
}

const listCommits = (installationId) => {
  const bot = new Octokit({
    previews: ['machine-man-preview'],
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_IDENTIFIER,
      privateKey: process.env.PRIVATE_KEY,
      installationId
    },
    request: request.defaults({
      baseUrl: 'https://api.github.ibm.com',
    }),
    baseUrl: 'https://api.github.ibm.com',
  });
  return bot.repos.listCommits();
}

const getInstallations = () => {
  const bot = new Octokit({
    previews: ['machine-man-preview'],
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_IDENTIFIER,
      privateKey: process.env.PRIVATE_KEY,
      installationId: '',
    },
    request: request.defaults({
      baseUrl: 'https://api.github.ibm.com',
    }),
    baseUrl: 'https://api.github.ibm.com',
  });
  return bot.apps.listInstallations();
};

const getAllAccessibleRepos = () => getInstallations()
  .then((installations) => Promise.all(
    installations.data.flatMap(
      (installation) => {
          const installationClient = new Octokit({
            previews: ['machine-man-preview'],
            authStrategy: createAppAuth,
            auth: {
              appId: process.env.GITHUB_APP_IDENTIFIER,
              privateKey: process.env.PRIVATE_KEY,
              installationId: installation.id,
            },
            request: request.defaults({
              baseUrl: 'https://api.github.ibm.com',
            }),
            baseUrl: 'https://api.github.ibm.com',
          });
          return installationClient.apps.listReposAccessibleToInstallation()
            .then((repos) => {
								repos.data.installationId = installation.id

                return repos.data
            });
        },
      ),
    )
    .then((reposLists) => reposLists.flat(1)));

export {
  getInstallations,
  getAllAccessibleRepos,
  listCommits,
  createRef,
  bot
};
