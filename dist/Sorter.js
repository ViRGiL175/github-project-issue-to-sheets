"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Importer = void 0;
const Core = require("@actions/core");
const rest_1 = require("@octokit/rest");
const GitHub = require("@actions/github");
let Importer = /** @class */ (() => {
    class Importer {
        async start() {
            try {
                Core.startGroup("🚦 Checking Inputs and Initializing...");
                const githubAccessToken = Core.getInput(Importer.INPUT_GITHUB_ACCESS_TOKEN);
                Core.info("Auth with GitHub Token...");
                const octokit = new rest_1.Octokit({
                    auth: githubAccessToken
                });
                Core.endGroup();
                Core.startGroup("📑 Getting all Issues in repository...");
                const issues = await octokit.issues.listForRepo({
                    owner: GitHub.context.repo.owner,
                    repo: GitHub.context.repo.repo
                });
                issues.data.forEach(value => {
                    Core.info(`${Importer.LOG_BULLET_ITEM} ${value.title}`);
                });
                Core.endGroup();
            }
            catch (error) {
                Core.setFailed(error);
            }
        }
    }
    Importer.LOG_SPACING_SIZE = 2;
    Importer.LOG_BULLET_ITEM = "·️";
    Importer.INPUT_GITHUB_ACCESS_TOKEN = "github-access-token";
    return Importer;
})();
exports.Importer = Importer;
