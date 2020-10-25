"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Importer = void 0;
const Core = require("@actions/core");
const rest_1 = require("@octokit/rest");
const GitHub = require("@actions/github");
const googleapis_1 = require("googleapis");
class Importer {
    async start() {
        try {
            Core.startGroup("🚦 Checking Inputs and Initializing...");
            const serviceAccountCredentials = Core.getInput(Importer.INPUT_SERVICE_ACCOUNT_JSON);
            const documentId = Core.getInput(Importer.INPUT_DOCUMENT_ID);
            const sheetName = Core.getInput(Importer.INPUT_SHEET_NAME);
            if (!serviceAccountCredentials || !documentId || !sheetName) {
                throw new Error("🚨 Some Inputs missed. Please check project README.");
            }
            Core.info("Auth with GitHub Token...");
            const octokit = new rest_1.Octokit();
            Core.info("Done.");
            Core.endGroup();
            Core.startGroup("📑 Getting all Issues in repository...");
            var page = 0;
            var issuesData = [];
            var issuesPage;
            do {
                Core.info(`Getting data from Issues page ${page}...`);
                issuesPage = await octokit.issues.listForRepo({
                    owner: GitHub.context.repo.owner,
                    repo: GitHub.context.repo.repo,
                    state: "all",
                    page
                });
                Core.info(`There are ${issuesPage.data.length} Issues...`);
                issuesData = issuesData.concat(issuesPage.data);
                if (issuesPage.data.length) {
                    Core.info("Next page...");
                }
                page++;
            } while (issuesPage.data.length);
            Core.info("All pages processed:");
            issuesData.forEach(value => {
                Core.info(`${Importer.LOG_BULLET_ITEM} ${value.title}`);
            });
            Core.endGroup();
            Core.startGroup("🔓 Authenticating via Google API Service Account...");
            const auth = new googleapis_1.google.auth.GoogleAuth({
                // Scopes can be specified either as an array or as a single, space-delimited string.
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
                credentials: JSON.parse(serviceAccountCredentials)
            });
            const sheets = googleapis_1.google.sheets({
                version: "v4",
                auth: auth
            });
            Core.info("Done.");
            Core.endGroup();
            Core.startGroup(`🧼 Cleaning old Sheet (${sheetName})...`);
            await sheets.spreadsheets.values.clear({
                spreadsheetId: documentId,
                range: sheetName,
            });
            Core.info("Done.");
            Core.endGroup();
            Core.startGroup(`🔨 Form Issues data for Sheets format...`);
            var issueSheetsData = [];
            for (const value of issuesData) {
                var labels = [];
                for (const label of value.labels) {
                    labels.push(label.name);
                }
                var assignees = [];
                for (const assignee of value.assignees) {
                    assignees.push(assignee.login);
                }
                issueSheetsData.push([
                    value.number,
                    value.state,
                    value.pull_request ? "Pull Request" : "Issue",
                    value.title,
                    JSON.stringify(labels),
                    JSON.stringify(assignees),
                    value.created_at,
                    value.closed_at,
                ]);
            }
            issueSheetsData.forEach(value => {
                Core.info(`${Importer.LOG_BULLET_ITEM} ${JSON.stringify(value)}`);
            });
            Core.endGroup();
            Core.startGroup(`📝 Adding Issues data to Sheet (${sheetName})...`);
            Core.info("Adding header...");
            await sheets.spreadsheets.values.append({
                spreadsheetId: documentId,
                range: sheetName + "!A1:1",
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    majorDimension: "ROWS",
                    range: sheetName + "!A1:1",
                    values: [
                        ["#", "Status", "Type", "Title", "Labels", "Assignees", "Created at", "Closed at"]
                    ]
                }
            });
            Core.info("Appending data...");
            await sheets.spreadsheets.values.append({
                spreadsheetId: documentId,
                range: sheetName + "!A1:1",
                valueInputOption: "USER_ENTERED",
                requestBody: {
                    majorDimension: "ROWS",
                    range: sheetName + "!A1:1",
                    values: issueSheetsData
                }
            });
            Core.info("Done.");
            Core.endGroup();
            Core.info("☑️ Done!");
        }
        catch (error) {
            Core.setFailed(error);
        }
    }
}
exports.Importer = Importer;
Importer.LOG_SPACING_SIZE = 2;
Importer.LOG_BULLET_ITEM = "·️";
Importer.INPUT_SERVICE_ACCOUNT_JSON = "google-api-service-account-credentials";
Importer.INPUT_DOCUMENT_ID = "document-id";
Importer.INPUT_SHEET_NAME = "sheet-name";
//# sourceMappingURL=Importer.js.map