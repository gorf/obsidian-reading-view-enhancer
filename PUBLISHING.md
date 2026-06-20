# Publishing to the Obsidian Community Plugin Marketplace

This guide explains how to publish **Block Step Reader（渐读）** to the official Obsidian community plugin directory.

## Prerequisites (done)

- [x] Public repo: https://github.com/gorf/obsidian-block-step-reader
- [x] `README.md`, `LICENSE`, `manifest.json` on `master`
- [x] GitHub release **0.5.1** (tag must match manifest, **no `v` prefix**) with `main.js`, `manifest.json`, `versions.json`
- [x] Ko-fi support URL in `manifest.json` → `https://ko-fi.com/bigmonk`
- [x] Fork of `obsidian-releases` with listing entry on branch `add-block-step-reader`

## Step 1: Submit via Obsidian Community (recommended)

Official process: https://docs.obsidian.md/Plugins/Releasing/Submit+your+plugin

1. Open https://community.obsidian.md and sign in with your **Obsidian account**
2. Link your **GitHub account** (`gorf`) in your profile
3. Sidebar → **Plugins** → **New plugin**
4. Repository URL:
   ```
   https://github.com/gorf/obsidian-block-step-reader
   ```
5. Agree to the [developer policies](https://docs.obsidian.md/Developer+policies)
6. Click **Submit**

Obsidian reads `manifest.json` from the default branch and installs release assets from the tag matching `version` exactly (currently **0.5.1** → tag **`0.5.1`**, not `v0.5.1`).

After automated review passes, publish from the directory UI. Users can then search **Block Step Reader** in Settings → Community plugins.

## Step 2: Alternative — PR to obsidian-releases

A listing entry is prepared on:

- Fork: https://github.com/gorf/obsidian-releases
- Branch: `add-block-step-reader`

Open a pull request to upstream (if the web form asks for it, or if you prefer the classic flow):

https://github.com/obsidianmd/obsidian-releases/compare/master...gorf:obsidian-releases:add-block-step-reader?expand=1

Entry added to `community-plugins.json`:

```json
{
  "id": "block-step-reader",
  "name": "Block Step Reader",
  "author": "gorf",
  "description": "Reader-like step reading: block navigation, reading library, per-user progress in frontmatter, and multi-language UI.",
  "repo": "gorf/obsidian-block-step-reader"
}
```

## After approval

1. Announce in [Share & showcase](https://forum.obsidian.md/c/share-showcase/9)
2. Optional: `#updates` on [Discord](https://discord.gg/veuWUTm) (requires developer role)

## Future releases

1. Bump `version` in `manifest.json`, `package.json`, and `versions.json`
2. `npm run build`
3. Create GitHub release with tag equal to `manifest.json` version (e.g. `0.5.2`, not `v0.5.2`) and attach `main.js`, `manifest.json`, `versions.json`
4. Users update from Community plugins — no need to resubmit unless Obsidian requests changes

```powershell
.\publish-github.ps1
```

## BRAT (beta)

```
https://github.com/gorf/obsidian-block-step-reader
```
