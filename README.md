# github-project-issue-to-sheets
Do you want to import your Issues info into Google Sheets?

Sometimes we need Repository dashboard, Burndown Chart and other analytics. Google Sheets is the simplest way to build your custom dashboard!

## But how?
It's pretty easy. But it requires some steps:

### 1. Enable Google Sheets API

Google provides cozy button for this:
![](https://i.imgur.com/MYMe1yP.png)

Create new API project and go to Credentials section.

### 2. Create Service Account

![](https://i.imgur.com/60JAuFo.png)

![](https://i.imgur.com/Tyg7Evk.png)

Then download and save your service account credentials JSON.

More info: https://developers.google.com/identity/protocols/oauth2/service-account#creatinganaccount

### 3. Create Google Sheets document

Then create new sheet for GitHub Issues data and add Google API Service Account email to your document with editor access

### 4. Add Action to your repository and provide input data

```yml
name: github-project-issue-to-sheets

# Controls when the action will run. Triggers the workflow on push or pull request
# events but only for the master branch
on:
  workflow_dispatch:
  issues:
    types: [opened, deleted, transferred, closed, reopened, assigned, unassigned, labeled, unlabeled]

jobs:
    github-project-issue-to-sheets:
        runs-on: ubuntu-latest
        name: github-project-issue-to-sheets
        steps:
        - name: github-project-issue-to-sheets
          id: github-project-issue-to-sheets
          uses: ViRGiL175/github-project-issue-to-sheets@dev
          with:
            google-api-service-account-credentials: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_DATA }}
            document-id: '1b0UuGS_HXTGv-BE9dcB_58gZvo5fttyKgle0s4DmRNI'
            sheet-name: 'GitHub Issues'
```

More info: https://docs.github.com/en/free-pro-team@latest/actions/learn-github-actions

### 5. Pass JSON Service Account credentials content as GitHub Secret

![](https://i.imgur.com/egWxleC.png)

More info: https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets

### 6. Look at the exported Issues data in your Sheets document

![](https://i.imgur.com/U2t3nmo.png)
