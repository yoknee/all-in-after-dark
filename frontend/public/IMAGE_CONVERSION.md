# Image Conversion Instructions

## Social Sharing Image (og-image)

The `og-image.svg` file has been created for social sharing. For best compatibility across all platforms (especially Facebook, Twitter, LinkedIn), you should convert it to PNG format.

### Recommended Size
- **1200x630 pixels** (already set in the SVG)

### Conversion Options

1. **Online Tools:**
   - Use https://cloudconvert.com/svg-to-png
   - Upload `og-image.svg` and set dimensions to 1200x630
   - Download as `og-image.png` and place in `/frontend/public/`

2. **Command Line (if ImageMagick is installed):**
   ```bash
   convert og-image.svg -resize 1200x630 og-image.png
   ```

3. **After conversion:**
   - Update `frontend/index.html` to change `/og-image.svg` to `/og-image.png` in the meta tags

### Note
Some platforms support SVG, but PNG is more universally compatible for Open Graph images.
