# Online MBA 2027 – plain HTML / CSS / JS version

No build step, no `npm`, no framework. Open `index.html` in a browser, or upload the whole folder to any web host.

```
index.html          the page (hero, universities, highlights, ribbon, #apply, trust strip, footer)
css/styles.css      all styles
js/config.js        site settings  → put your Google Sheet web-app URL in `sheetUrl`
js/data.js          all comparison / fee / link content  → edit text and numbers here
js/icons.js         inline SVG icons
js/app.js           behaviour: scroll effects, the 3-step form, validation, saving to the sheet
img/ logos/ downloads/ prospectus/   pictures, university logos, brochure files
```

## How the form works
`js/app.js` swaps three steps inside `<section id="apply">` – **1 Basic Details → 2 Compare → 3 Admission Details → Thank you**.
Answers are kept in `sessionStorage` (this tab only) and cleared after a successful submit.
On submit, one JSON row is POSTed to the Google Apps Script URL in `js/config.js`
(a Google Apps Script web app that appends rows to your sheet). The request is "fire and forget", so the page can only
detect network failures, not whether Google wrote the row – check the sheet / Apps Script *Executions* page.

## Things to know
- If `sheetUrl` is empty the form shows "Spreadsheet is not connected yet" instead of a false success.
- Anyone can read `js/config.js` (it is public on any static host) – that is normal for an Apps Script web-app URL.
- The brochure PDFs are not included – see `prospectus/README.md`.
- The footer links and social icons are placeholders (`href="#"`).
