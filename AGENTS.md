# Repository instructions

This is Cyrus / 周树勋's personal research blog, publishing Astro at `/` and the official Hexo NexT theme at `/next/` from the same content.

- Preserve the 10 migrated Hexo posts and their original redirects. Do not overwrite the user's old Obsidian directories.
- The user explicitly reserves editing their personal biography and profile prose. Do not rewrite, polish, or change those texts without a specific request. Relevant files: `src/config.ts`, the introduction and sidebar in `src/pages/index.astro`, `src/pages/about/index.astro`, and the profile fields in `variants/next/_config.yml`.
- Public English name: Cyrus. GitHub account and current Pages hostname: hblgzsx / hblgzsx.github.io. Do not rename the account or claim cyrus.github.io is available.
- Use the shared content in `src/content/posts/` and `src/content/typst/`. `variants/next/source/` is generated; never maintain a second copy of article content there.
- Keep the visual style restrained, suitable for academic reading, with a muted green palette. Avoid decorative animation, large photo banners and unnecessary third-party services.
- Required validation for relevant changes: `npm run check`, `npm run build`, `npm run verify`. Use the browser checks for layout or behavior changes.

- The homepage is an academic CV, with biography, research interests, publications, education and honors. Its editable data is `src/data/profile.json`; the same academic content is rendered in both themes. Use verified fields from the user's Typst academic homepage; other resume folders include template placeholders that must not be presented as facts.
- Keep raw CNBlogs backups and non-public records under `.private/` or ignored ZIPs. Public imports have a manifest in `docs/cnblogs-migration-report.json`.
