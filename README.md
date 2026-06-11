# Block Step Reader

> Fork and continuation of [Galacsh/obsidian-reading-view-enhancer](https://github.com/Galacsh/obsidian-reading-view-enhancer) (upstream unavailable). Original block navigation by Galacsh (MIT). Additional maintenance and reading-position features by [gorf](https://github.com/gorf).

Block Step Reader improves reading in Obsidian's **reading view**:

- Keyboard block navigation (`J` / `K` or arrow keys)
- Highlight the current block
- Remember and restore your last reading position
- Optional block highlight, collapse controls, and reading-view tweaks from the original plugin

## Quick start

1. Install `main.js` and `manifest.json` into `.obsidian/plugins/block-step-reader/`
2. Enable **Block Step Reader** in community plugins
3. Open a note in **reading view**
4. Turn on **Enable Block Selector** in plugin settings
5. Use `J` / `↓` for next block, `K` / `↑` for previous block

## Remember reading position

Enabled by default. The plugin saves the current block and scroll position while you read, then restores it when you reopen the note.

Settings:

- **Remember reading position**
- **Show restore notice**
- **Save delay (ms)**
- **Restore delay (ms)**

## Install

### BRAT

1. Install **Obsidian42-BRAT**
2. Add beta plugin: `https://github.com/gorf/obsidian-block-step-reader`

### Manual / local build

```powershell
git clone https://github.com/gorf/obsidian-block-step-reader.git
cd obsidian-block-step-reader
npm install
npm run build
```

Copy `main.js` and `manifest.json` to your vault's `.obsidian/plugins/block-step-reader/`.

Or run:

```powershell
.\install-to-vault.ps1 -VaultPath "D:\path\to\your\vault"
```

## Keyboard defaults

| Key | Action |
|-----|--------|
| `↓` / `J` | Next block |
| `↑` / `K` | Previous block |
| `←` / `→` / `H` / `L` | Toggle collapse |
| `Escape` | Deselect block |

## Development

```powershell
npm run build
.\install-to-vault.ps1
.\publish-github.ps1
```

## License

MIT. Original work by Galacsh; maintenance fork by gorf.
