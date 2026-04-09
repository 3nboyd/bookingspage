const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const REQUEST_SHEET_NAME = 'Requests';
const NOTIFICATION_EMAIL = 'noahbboyd@gmail.com';
const ALLOWED_GENRES = ['Pop', 'House', 'RNB', 'Latin', 'Rock', 'Country'];
const SONG_REQUEST_FALLBACK = 'No specific song provided';
const GENRE_FALLBACK = 'No genre selected';

function doPost(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const songRequest = normalizeText_(params.songRequest);
    const genre = normalizeText_(params.genre);
    const honeypot = normalizeText_(params.website);

    if (honeypot) {
      return buildIframeResponse_({ type: 'song-request-result', status: 'success' });
    }

    if (!songRequest && !genre) {
      return buildIframeResponse_({
        type: 'song-request-result',
        status: 'error',
        message: 'A song request or genre is required.'
      });
    }

    if (genre && !ALLOWED_GENRES.includes(genre)) {
      return buildIframeResponse_({
        type: 'song-request-result',
        status: 'error',
        message: 'Invalid genre selection.'
      });
    }

    const songRequestValue = songRequest || SONG_REQUEST_FALLBACK;
    const genreValue = genre || GENRE_FALLBACK;
    const sheet = getRequestSheet_();
    sheet.appendRow([new Date(), escapeFormula_(songRequestValue), genreValue]);

    MailApp.sendEmail({
      to: NOTIFICATION_EMAIL,
      subject: 'New DJ request received',
      body: [
        'A new song request came in.',
        '',
        `Song Request: ${songRequestValue}`,
        `Genre: ${genreValue}`,
        `Timestamp: ${new Date().toLocaleString()}`
      ].join('\n')
    });

    return buildIframeResponse_({ type: 'song-request-result', status: 'success' });
  } catch (error) {
    console.error(error);
    return buildIframeResponse_({
      type: 'song-request-result',
      status: 'error',
      message: 'Something went wrong while saving the request.'
    });
  }
}

function getRequestSheet_() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID === 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE') {
    throw new Error('Set SPREADSHEET_ID before deploying the web app.');
  }

  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(REQUEST_SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(REQUEST_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Song Request', 'Genre']);
  }

  return sheet;
}

function buildIframeResponse_(payload) {
  const safePayload = JSON.stringify(payload);
  const html = `
    <!DOCTYPE html>
    <html>
      <body>
        <script>
          window.parent.postMessage(${safePayload}, '*');
        </script>
      </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function normalizeText_(value) {
  return String(value || '').trim();
}

function escapeFormula_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}
