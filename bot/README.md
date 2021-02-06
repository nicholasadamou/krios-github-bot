# Krios GitHub Bot 🤖

## Rationale

This package's intent is to automatically create pull requests after a version of given lib is updated. Each PR will be created in a repo which depends on the package which has been updated and will suggest to merge a modified `package.json` or `requirements.txt` file based on the passed Bill of Actions.

## Installation

To run this app you should follow such steps:

1. Clone this repository via `git clone git@github.com/nicholasadamou/krios-github-bot.git`
2. Install `babel-cli` globally `npm install @babel/cli -g && npm install @babel/node -g`
3. Install packages by `npm install`
4. [Create a GitHub App](https://developer.github.com/apps/building-github-apps/creating-a-github-app/) and obtain its credentials (e.g. `PRIVATE_KEY`, `GITHUB_APP_IDENTIFIER`, etc). Install the bot onto a specific repository.
5. Create `.env` file with following contents:

```text
PRIVATE_KEY="-----BEGIN RSA PRIVATE\n... your private key for the GitHub App goes here"
GITHUB_APP_IDENTIFIER=your app ID
GITHUB_WEBHOOK_URL=your webhook URL
LIBRARIES_IO_API_KEY=your libraries.io API key
PORT=the port the bot should be listening on (defaults to 3000)
```

6. (_Docker_) Run `npm run docker` to build and launch the docker container of this app.
7. (_Node_) Run `npm run dev` to launch the app using `nodemon`.
8. Send a **POST** request to the running server at `http://localhost:3000` with the body:

```json
{
    "owner": "<REPOSITORY_OWNER_NAME>",
    "repoName": "<REPOSITORY_NAME>",
    "gitURL": "<URL>",
    "gitBranch": "<BRANCH>",
    "commitID": "<COMMIT_ID>"
}
```

9. (_tests_) Run `npm run test` to launch `jest` for running integration tests.

## Webhooks using [smee.io](https://smee.io/) - A webhook payload delivery service

1. Visit [smee.io](https://smee.io/) and click on [start a new channel](https://smee.io/new).
2. Copy the Webhook Proxy URL that was generated.
3. Paste that URL into the `.env` file under the key `GITHUB_WEBHOOK_URL`.

## License

Krios is distributed under the Apache 2.0 License.
