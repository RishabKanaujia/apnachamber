# Kanoujia & Associates: Advocate Website Template

A responsive single-page website for Indian advocates and boutique law firms. Plain HTML, CSS and JavaScript. No build step, no frameworks.

## Run it
Open `index.html` in a browser. Fonts load from Google Fonts when online and fall back to Georgia and system fonts when offline.

## Customise (search for `CUSTOMISE` in the files)
| What | Where |
|---|---|
| Firm name, text, qualifications, address, hours | `index.html` |
| Phone, email, WhatsApp number, form endpoint | `CONFIG` at the top of `js/script.js` |
| Colours and fonts | `:root` in `css/style.css` |
| Team members | Copy an `<article class="member">` block |
| Practice areas | Copy an `<article class="card">` block |
| Google Maps | Paste your embed `<iframe>` inside `.map` |
| SEO / Open Graph / structured data | `<head>` of `index.html` (add telephone and address only when accurate) |
| Privacy Policy and Terms text | `DOCS` object in `js/script.js` |
| Social links | Footer `.social` links (currently `#`) |

## Images
The files in `images/` are **illustrated placeholders**, not photographs. Replace them with your own, keeping the file names (`hero.jpg`, `advocate.jpg`, `office.jpg`, `team-2.jpg`, `team-3.jpg`, `logo.png`). Use portraits about 800x1000 px and a hero about 1600x1200 px. Only use photographs you own or have licensed.

## Contact form
The form validates in the browser but **sends nothing** until you set `formEndpoint` in `js/script.js` (for example a Formspree or Web3Forms URL). Until then, it clearly tells the visitor the message was not sent and offers WhatsApp and email with the details prefilled.

## Before you publish: Bar Council of India
- Advocates are restricted from advertising and solicitation under the Bar Council of India Rules (Part VI, Chapter II, Section II). Have the final content checked against the current rules and any State Bar Council directions.
- Replace every `[bracketed]` placeholder and every `XX`. Do not publish unverifiable claims, case results or ranking statements.
- Testimonials are marked as samples. Delete that section unless it complies with the rules.
- Replace the privacy policy and terms with proper text. Consider the Digital Personal Data Protection Act, 2023, since the form collects personal data.
