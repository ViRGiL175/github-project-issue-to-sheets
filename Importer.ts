import * as Core from "@actions/core";
import {Octokit} from "@octokit/rest";
import * as GitHub from "@actions/github";

export class Importer {

    public static LOG_SPACING_SIZE = 2
    public static LOG_BULLET_ITEM = "·️";
    public static INPUT_GITHUB_ACCESS_TOKEN = "github-access-token"

    public async start(): Promise<void> {
        try {

            Core.startGroup("🚦 Checking Inputs and Initializing...")
            const githubAccessToken = Core.getInput(Importer.INPUT_GITHUB_ACCESS_TOKEN);
            Core.info("Auth with GitHub Token...")
            // const octokit = new Octokit({
            //     auth: githubAccessToken
            // })
            const octokit = new Octokit()
            Core.endGroup()

            Core.startGroup("📑 Getting all Issues in repository...")
            const issues = await octokit.issues.listForRepo({
                owner: GitHub.context.repo.owner,
                repo: GitHub.context.repo.repo
            });
            issues.data.forEach(value => {
                Core.info(`${Importer.LOG_BULLET_ITEM} ${value.title}`)
            })
            Core.endGroup()

        } catch (error) {
            Core.setFailed(error)
        }
    }
}
