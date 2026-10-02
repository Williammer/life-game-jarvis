# Impeccable detector — one run

Command: `impeccable detect --json index.html styles.css app.js`, 2026-09-30. Exit 2 denotes findings.

| Finding | Action |
|---|---|
| overused-font / Inter, emitted for HTML and CSS | Removed unused Inter preference. Chinese native PingFang / Microsoft YaHei / system fonts suit this Operate prototype. |
| dark-glow / #18383e shadow | Page is light, shadows already had offsets; changed shadow color to neutral black. |
| side-tab / 2px right border | This was the divider between budget segments, not a card accent. Reduced to 1px. |
| codex-grid-background, emitted for HTML and CSS | Retained only on the actual capability map. It is not a page background; request expressly includes a game growth map. |

No hook is installed. Detector was not rerun. Independent reviewer should assess the retained map grid in context.

First screenshot pass also found a squeezed budget strip in a flex row, a root-background band and an unused map branch. The single correction batch grouped the budget, contained body margins and removed the branch. Current step scrolls into view on narrow navigation; form placeholders now explicitly use the verified muted text token.
