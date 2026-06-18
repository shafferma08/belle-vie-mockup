# Image Optimization Workflow

## Overview
This document outlines the image management and optimization process for Belle Vie Hair Spa website.

## Directory Structure

```
assets/
├── img/
│   ├── gallery/                    # Client-uploaded gallery photos (originals)
│   ├── team/                       # Team headshots
│   ├── optimized/                  # Resized & optimized versions for web
│   │   ├── BE032026-208-1600.jpg  # Hero image (full width)
│   │   ├── gallery/               # 1200px optimized gallery
│   │   ├── thumbs/                # 400px thumbnails for sliders
│   │   └── team/                  # 600px team headshots
│   ├── uploaded/                   # ⚠️ IGNORED - never commit here (in .gitignore)
│   ├── logo/
│   ├── [other existing images]
```

## Image Sizes & Usage

| Purpose | Size | Format | Quality | Location |
|---------|------|--------|---------|----------|
| Hero Section | 1600px | JPEG | 85% | `optimized/` |
| Gallery Display | 1200px | JPEG | 85% | `optimized/gallery/` |
| Gallery Thumbnails | 400px | JPEG | 80% | `optimized/thumbs/` |
| Team Headshots | 600px | JPEG | 85% | `optimized/team/` |

## Workflow: Adding New Photos

### 1. **Receive & Extract**
- Client provides zip file with photos
- Extract to temporary location (e.g., `assets/img/uploaded/`)

### 2. **Organize**
- Move originals to appropriate folder:
  - Gallery/lifestyle → `assets/img/gallery/`
  - Headshots → `assets/img/team/`
  - Any other type → category-specific folder

### 3. **Resize & Optimize**
Use macOS `sips` tool (no installation needed):

```bash
# Generate optimized versions
mkdir -p assets/img/optimized/gallery assets/img/optimized/thumbs assets/img/optimized/team

# Gallery: 1200px
sips -Z 1200 "assets/img/gallery/photo.jpg" --out "assets/img/optimized/gallery/photo-1200.jpg"

# Thumbnails: 400px
sips -Z 400 "assets/img/gallery/photo.jpg" --out "assets/img/optimized/thumbs/photo-400.jpg"

# Team headshots: 600px
sips -Z 600 "assets/img/team/headshot.jpg" --out "assets/img/optimized/team/headshot-600.jpg"
```

### 4. **Generate WebP (Optional, For Future)**
Install `webp` via Homebrew and use `cwebp`:

```bash
brew install webp
cwebp -q 85 "assets/img/optimized/gallery/photo-1200.jpg" -o "assets/img/optimized/gallery/photo-1200.webp"
```

Then update HTML to use WebP with JPEG fallback:
```html
<picture>
  <source srcset="assets/img/optimized/gallery/photo-1200.webp" type="image/webp">
  <img src="assets/img/optimized/gallery/photo-1200.jpg" alt="Description" loading="lazy">
</picture>
```

### 5. **Update HTML**
- Add `loading="lazy"` to gallery images
- Reference optimized paths (e.g., `assets/img/optimized/gallery/photo-1200.jpg`)
- Update `og:image` meta tags if hero changes

### 6. **Archive & Cleanup**
- Move original uploads to archive folder outside repo:
  ```bash
  mv assets/img/uploaded/ ../belle-vie-uploads-archive-YYYYMMDD-HHMMSS/
  mv ../zip.zip ../belle-vie-uploads-archive-YYYYMMDD-HHMMSS/
  ```
- Add `assets/img/uploaded/` to `.gitignore` to prevent future re-commits

### 7. **Commit & Push**
```bash
git add -A
git commit -m "Add/update photos and optimized versions"
git push origin main
```

## Current Setup (as of 2026-06-17)

- ✅ Original client photos → `assets/img/gallery/` & `assets/img/team/`
- ✅ Resized/optimized versions → `assets/img/optimized/`
- ✅ Lazy loading added to all gallery images
- ✅ og:image meta tags updated (index.html, our-story.html)
- ✅ New studio photos added to hair-spa.html portfolio
- ✅ Original uploads archived outside repo
- ⏳ WebP generation — ready to implement when needed

## File Naming Convention

- **Originals:** Preserve client naming or descriptive (e.g., `BE032026-208.JPG`, `shawna-headshot.jpg`)
- **Optimized:** `{originalname}-{size}.jpg` (e.g., `BE032026-208-1200.jpg`, `shawna-headshot-600.jpg`)

## Performance Tips

1. **Always optimize before committing** — reduces repo size and improves page load
2. **Use lazy loading** on below-the-fold images
3. **Test image sizes** — ensure they look good on mobile/desktop
4. **Consider responsive images** — use `srcset` for different screen densities in the future
5. **Monitor image file sizes** — aim for < 300KB per image after optimization

## Checklist for Future Uploads

- [ ] Extract zip to temporary folder
- [ ] Organize into `gallery/`, `team/`, or category folders
- [ ] Generate optimized sizes (1200, 400, 600, etc.)
- [ ] Update relevant HTML pages
- [ ] Add `loading="lazy"` to new images
- [ ] Archive originals outside repo
- [ ] Add `assets/img/uploaded/` to `.gitignore`
- [ ] Commit with descriptive message
- [ ] Push to remote
