# NBZ event links and song requests

A static landing page for event QR codes, with social links, payment links, contact information, and a separate song-request page.

## Local preview

```sh
git clone https://github.com/3nboyd/bookingspage.git
cd bookingspage
python3 -m http.server 8000
```

Open [localhost:8000](http://localhost:8000) for the landing page or [localhost:8000/requests/](http://localhost:8000/requests/) for song requests.

## Files and hosting

- `index.html`, `styles.css`, and `script.js` provide the landing page and shared interactions.
- `requests/index.html` contains the song-request form.
- `site-config.js` sets the Apps Script endpoint used by the form.
- `google-apps-script/` contains the separate Google Sheets and notification backend.

The site can be served by a static host, including GitHub Pages. Song requests require a deployed Apps Script web app; follow the [backend setup guide](google-apps-script/README.md) before testing submissions. The static preview does not create a Google Sheet or deploy that backend.
