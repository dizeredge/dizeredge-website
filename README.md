# DizerEdge static website

Open `index.html` in a browser. All eight pages use plain HTML, CSS, and JavaScript. No installation, build step, backend, or external assets are required.

For a local HTTP preview, run `python -m http.server 8000 --bind 127.0.0.1` in this directory and open `http://127.0.0.1:8000`.

## Pages

- `index.html` — company and verification platform overview
- `products.html` — seven product offerings and category filters
- `solutions.html` — onboarding, account protection, enterprise access, and workforce workflows
- `developers.html` — integration approach and illustrative workflow configuration
- `security.html` — security, privacy, and deployment review principles
- `industries.html` — eight industry groups and use cases
- `company.html` — company overview, mission, vision, and engagement approach
- `contact.html` — local inquiry preparation, copying, and text download

## Updating the website

Shared styles are in `assets/styles.css`; interactions are in `assets/app.js`. The favicon and header mark are original SVG artwork. Update navigation and footer content consistently across the HTML files.

The company profile contains no verified contact address. The inquiry builder therefore prepares a brief locally; it does not send messages or persist form data. Configure a genuine contact destination or form service before enabling inquiry delivery. The copy button includes a text-selection fallback when clipboard access is unavailable.

Product availability and implemented security controls are not established by the profile's roadmap. The site describes the portfolio with appropriate scope qualifications, does not invent API endpoints, and makes no certification or government-approval claims. The developer JSON and identity illustration are explicitly illustrative.

Upload the eight HTML files and the `assets` directory together to any static web host, preserving their relative paths.
