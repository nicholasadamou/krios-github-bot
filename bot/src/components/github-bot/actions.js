/* eslint-disable no-await-in-loop */
import dotenv from 'dotenv';
import { createAppAuth } from '@octokit/auth-app';
import { request } from '@octokit/request';
import { Octokit } from '@octokit/rest';
import createBillOfMaterials from '../bill-of-materials';
import createBillOfActions from '../bill-of-actions';

dotenv.config();

const updateFile = (bot, repo, updatedManifest) => {
	return bot.git.getRef({
        owner: repo.owner.login,
        repo: repo.name,
        ref: 'heads/master',
	})
	.then((ref) => {
		console.log(ref);

		return bot.git.createTree({
			owner: repo.owner.login,
			repo: repo.name,
			tree: [
				{
					path: updatedManifest.path,
					mode: '100644',
					type: 'blob',
					content: updatedManifest.content,
				},
			],
			base_tree: ref.data.object.sha,
		})
		.then((tree) => {
			console.log(ref);

			return { tree, ref };
		});
	})
	.then(({ tree, ref }) => {
		return bot.git.createCommit({
			owner: repo.owner.login,
			repo: repo.name,
			message: updatedManifest.message,
			parents: [ref.data.object.sha],
			tree: tree.data.sha,
		});
	})
	.then((commit) => {
		console.log(commit);

		return bot.git.createRef({
			owner: repo.owner.login,
			repo: repo.name,
			ref: `refs/heads/${updatedManifest.branch}`,
			sha: commit.data.sha,
		});
	})
	.then((ref) => {
		console.log(ref);

		return bot.pulls.create({
			owner: repo.owner.login,
			repo: repo.name,
			title: updatedManifest.title,
			head: updatedManifest.branch,
			base: 'master',
		});
	});
};

/*
updatedManifest
	- path
	- content
	- message
	- branch
	- title
*/

const billOfActionsToUpdatedManifests = (billOfActions) => {
	console.log(billOfActions);

	return billOfActions.assets.map((asset) => {
		const updatedAsset = { ...asset };
		let content = '';

		updatedAsset['pip-packages'].forEach((dependency) => {
			content += `${dependency.name}==${dependency.latest_release_number}\n`;
		});

		updatedAsset.updatedManifest = {
			path: updatedAsset.manifest,
			content,
			message: `Updated ${updatedAsset.manifest}`,
			branch: `update-${updatedAsset.manifest}-${Date.now()}`,
			title: `Updated ${updatedAsset.manifest}`,
		};

		return updatedAsset;
	});
};

const fetchUpdatedManifests = (
	gitURL,
	gitBranch,
	commitID,
) => createBillOfMaterials(gitURL, gitBranch, commitID)
	.then((billOfMaterials) => createBillOfActions(billOfMaterials))
	.then((billOfActions) => billOfActionsToUpdatedManifests(billOfActions));

const fetchGitHubResources = async (owner, repoName) => {
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

	return bot.apps.getRepoInstallation({
			owner,
			repo: repoName,
		})
		.then((install) => { console.log(install.data.id); return install; })
		.then((install) => new Octokit({
				previews: ['machine-man-preview'],
				authStrategy: createAppAuth,
				auth: {
					appId: process.env.GITHUB_APP_IDENTIFIER,
					privateKey: process.env.PRIVATE_KEY,
					installationId: install.data.id,
				},
				request: request.defaults({
				baseUrl: 'https://api.github.ibm.com',
				}),
				baseUrl: 'https://api.github.ibm.com',
		}))
		.then((bot) => {
			const repoData = bot.repos.get({
				owner,
				repo: repoName,
			})
			.then((repo) => repo.data);
			return Promise.all([bot, repoData]);
		});
};

const updateAllDependents = (req, res) => {
	console.log('🤖 obtained a new request.');
	console.log(req.body);

	// STEP 1: Fetch Bill of Materials
	const billOfActionsPromise = fetchUpdatedManifests(
		req.body.gitURL,
		req.body.gitBranch,
		req.body.commitID,
		);
	// and GitHub resources
	const fetchGithubResourcePromise = fetchGitHubResources(req.body.owner, req.body.repoName);

	return Promise.all([fetchGithubResourcePromise, billOfActionsPromise])
		.then(async ([[bot, repo], updatedManifest]) => {
			await updatedManifest.forEach(async (manifest) => {
				await updateFile(bot, repo, manifest.updatedManifest);
			});
		})
		.then(() => {
			res.json({
				status: 'Done! 🚀',
			});
		})
		.catch((err) => {
			console.log(`Error: ${err}`);

			res.json({
				status: 500,
				message: `${err}`
			});
		});
};

export default updateAllDependents;
