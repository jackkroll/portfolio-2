# Photo metadata tool

Local UI for writing album-level `metadata.json` files before uploading folders to R2.

## Usage

From the portfolio root:

```bash
npm run photos:meta
```

Then open http://127.0.0.1:5174

1. Paste the path to a folder that contains album subfolders
2. Scan (reads width/height/aspect ratio automatically)
3. Set album title, description, and default tags
4. Optionally expand **Edit images** for per-photo overrides
5. Tune lightbox matting (default: white, 20%)
6. Save one album or Save all

Upload the folders (with their `metadata.json` files) to the `img` R2 bucket afterward.

## `metadata.json` shape

```json
{
  "title": "Iceland 2024",
  "description": "South coast road trip.",
  "location": "Reykjavik, Iceland",
  "filmStock": "Kodak Portra 400",
  "camera": "Olympus XA",
  "matting": {
    "enabled": true,
    "color": "#ffffff",
    "percent": 20
  },
  "images": {
    "DSCF0001.jpg": {
      "title": "Harbor evening",
      "description": "Optional caption",
      "location": "Optional override",
      "width": 4200,
      "height": 2800,
      "aspectRatio": 1.5
    }
  }
}
```
