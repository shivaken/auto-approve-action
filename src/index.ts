import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
	try {
		const token = core.getInput("github-token", { required: true });
		const message = core.getInput("message") || "Auto-approved by GitHub Action :robot";

		const { context } = github;
		const pr = context.payload.pull_request;

		if (!pr) {
			throw new Error("This action must run on pull_request or pull_request_tareget events");
		}

		const octokit = github.getOctokit(token);
		const { owner, repo } = context.repo;
		const pull_number = pr.number;

		// Submit an approval review
		await octokit.rest.pulls.createReview({
			owner,
			repo,
			pull_number,
			event: "APPROVE",
			body: message,
		});

		core.setOutput("approved", "true");
		core.info(`Approved PR #${pull_number}`);
	} catch (err: any) {
		core.setFailed(err?.message ?? String(err));
	}
}

run();
