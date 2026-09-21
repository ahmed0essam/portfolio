# Ahmed Essam — SEO portfolio

Static site, no build step and no runtime dependencies.

**Live:** https://ahmed0essam.github.io/portfolio/

```
index.html                              home
case-studies.html                       case study index (filterable)
case-studies/enterprise-logistics.html
case-studies/real-estate-developer.html
case-studies/jewellery-ecommerce.html
css/   main.css  home.css  case-studies.css  case-study.css
js/    main.js  filter.js
images/  case study screenshots
```

## Deploying

GitHub Pages serves `main` from the repository root:

```bash
git add -A && git commit -m "Update copy" && git push
```

Live within about a minute.

## Contact details

- **Email** `ahmed0essaam@gmail.com`
- **LinkedIn** https://eg.linkedin.com/in/-ahmed-essam
- **Upwork** still points at the email, because no profile URL has been supplied.
  The nav button reads "Hire me" rather than "Hire me on Upwork" for the same reason.
  Once the URL exists, update the Upwork card in the contact section of `index.html`
  and change the button label back.

## Known cosmetics, inherited

- `body` sets `overflow-x: hidden` but `html` does not, so the document reports about
  110px of horizontal overflow on a wide desktop viewport. Body clips it so no scrollbar
  appears and nothing is cut off. Adding `overflow-x: hidden` to the `html` rule in
  `css/main.css` silences it.
- `.mobile-nav` is 96% opaque with no `backdrop-filter`, so the hero headline shows
  through the open menu very faintly. Adding `backdrop-filter: blur(20px)` to match the
  `nav` rule above it would remove that.

## Provenance

This is a replica of a joint portfolio, rebuilt under Ahmed's name as the two
contributors split into separate sites. The headline figures (7.2M clicks, 180M
impressions, and the three case studies) describe work delivered jointly.

Worth knowing: the other portfolio carries the same figures and near-identical copy.
Two sites claiming identical totals can undercut both in front of a client, and the
duplicate copy means they compete with each other in search. Differentiating the copy
later is the fix if that becomes a problem.
