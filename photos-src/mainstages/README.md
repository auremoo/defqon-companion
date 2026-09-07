# Mainstage photo sources

Drop your original mainstage photos here, one folder per edition year:

```
photos-src/mainstages/
  2025/
    IMG_0421.jpg
    red-stage-endshow.jpg
  2024/
    ...
```

Any JPEG / PNG / WebP / TIFF, any size — originals are never shipped as-is.

Then run:

```bash
npm run photos
```

That generates optimized WebP versions (full 1600px + 480px thumbnail) into
`public/mainstages/<year>/` and rewrites `public/data/mainstage-photos.json`,
which the **Photos** tab of the MainStage page reads.

## Captions

The filename becomes the caption when it looks like a real name:
`red-stage-endshow.jpg` -> "Red stage endshow". Camera filenames
(`IMG_0421.jpg`, `DSC_0032.jpg`, `20250627.jpg`) get no caption.

## Git

The originals in this folder are **not** committed (see `.gitignore`) —
they are usually large. Only the optimized output in `public/mainstages/`
and the manifest are versioned. Keep your originals backed up elsewhere.
