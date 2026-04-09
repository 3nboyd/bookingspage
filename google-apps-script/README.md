# Google Song Request Setup

This folder contains the Google Apps Script backend for the song request page.

## 1. Create the Google Sheet

1. Sign in as `noahbboyd@gmail.com`.
2. Create a new Google Sheet.
3. Copy the spreadsheet ID from the URL.

## 2. Create the Apps Script web app

1. In the Google Sheet, open `Extensions > Apps Script`.
2. Replace the default script with the contents of `Code.gs`.
3. In `Project Settings`, enable the `Show "appsscript.json" manifest file in editor` option if it is hidden, then replace that manifest with `appsscript.json`.
4. In `Code.gs`, set `SPREADSHEET_ID` to the sheet ID you copied.
5. Confirm `NOTIFICATION_EMAIL` is the inbox you want for alerts.

## 3. Deploy it publicly

1. Click `Deploy > New deployment`.
2. Choose `Web app`.
3. Set `Execute as` to `Me`.
4. Set access so anyone with the link can use it.
5. Authorize the script.
6. Copy the deployed `/exec` URL.

## 4. Connect the website

1. Open `/Users/nbz/Library/Mobile Documents/com~apple~CloudDocs/Github/bookingspage/site-config.js`.
2. Replace `REPLACE_WITH_YOUR_DEPLOYED_APP_ID` with the real Apps Script deployment ID or paste the full `/exec` URL.
3. Publish the updated site.

## 5. Verify the flow

1. Open the song request page.
2. Submit a test request.
3. Confirm the Google Sheet gets a new row in the `Requests` tab.
4. Confirm `noahbboyd@gmail.com` receives the notification email.
