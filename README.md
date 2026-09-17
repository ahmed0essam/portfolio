# Ahmed Essam — SEO portfolio

Static portfolio site. No build step, no framework, no runtime dependencies.

**Live:** https://ahmed0essam.github.io/portfolio/

```
index.html           the whole page
assets/styles.css    theme tokens + layout
assets/app.js        mobile nav, scroll spy, footer year
```

## Editing

Content is all in `index.html`, in labelled sections: hero, services, results, work, dashboards, approach, tools, contact. Edit the markup directly.

Design tokens live at the top of `styles.css` — change `--accent` to reshade the whole site.

## Deploying

GitHub Pages serves `main` from the repository root. Push and it's live within a minute:

```bash
git add -A && git commit -m "Update copy" && git push
```

## Notes on the content

Headline figures (7.2M clicks, 180M impressions, the three case studies) come from engagements delivered as part of a team. Each result card states what was personally owned rather than implying sole credit, which matters because a second portfolio covers overlapping work — two sites claiming identical totals undermines both, and duplicate copy would have them competing in search.

No client is named and no figure is published that hasn't been cleared. The work section describes sector and scope only.
