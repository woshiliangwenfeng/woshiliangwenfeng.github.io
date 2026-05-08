# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Game Guides Hub is a static website deployed on GitHub Pages, providing comprehensive video game walkthroughs, tips, and strategies. The site is optimized for SEO, AdSense monetization, and serves primarily European and American audiences.

## Project Structure

### Root Directory
- **index.html** - Main landing page with featured games and latest guides
- **favicon.ico** - Website favicon
- **robots.txt** - Search engine crawler rules
- **sitemap.xml** - XML sitemap for search engines

### Pages Directory (`pages/`)
- **guides.html** - Game guides library page with search and filtering
- **tools.html** - Essential gaming tools and software recommendations
- **about.html** - About page with mission and team information
- **contact.html** - Contact page with email information
- **privacy.html** - Privacy policy (required for AdSense)

### Guides Directory (`guides/`)
- **elden-ring-beginner-guide.html** - Example game guide (Elden Ring beginner guide)
- **game-guide-template.html** - Template for creating new game guide pages
- **game-guide-adsense-template.html** - AdSense-optimized template

### Docs Directory (`docs/`)
- **CLAUDE.md** - This file - development guide for Claude Code
- **ADSENSE.md** - Google AdSense integration guide
- **SEO_README.md** - SEO optimization guide and next steps

## Development Setup

This is a static HTML site with no build process or dependencies. Files are served directly via GitHub Pages.

### Local Development
1. Open any HTML file in a web browser
2. Or use a simple HTTP server:
   ```bash
   python -m http.server 8000
   ```
   Then visit http://localhost:8000

### Deployment
The site is automatically deployed to GitHub Pages from the `main` branch. Push changes to `main` to update the live site at https://woshiliangwenfeng.github.io/

## Content Guidelines

### Creating New Game Guides
1. Copy `guides/game-guide-template.html` as a new file in the `guides/` directory
2. Replace template placeholders with actual content
3. Update meta tags for SEO:
   - Title: "[Game Name] [Guide Type] | Game Guides Hub"
   - Description: Include game name, guide type, and key features
   - Keywords: Game name, genre, platform, guide-specific terms
4. Update navigation links to use relative paths (`../pages/` for navigation)
5. Add internal links to connect related guides
6. Include AdSense placeholder positions (top banner, in-article, sidebar)
7. Target 2000+ words for comprehensive SEO content

### Link Structure
- Update `index.html` Featured Games section to link to new guides (`guides/your-guide.html`)
- Update `pages/guides.html` Featured Games section to link to new guides (use relative path)
- Add sidebar links in existing guides to point to related content
- Ensure all navigation links point to correct files:
  - In `index.html`: `pages/` prefix for all links except index
  - In `pages/` directory files: relative paths (`../index.html`, `guides.html`, etc.)
  - In `guides/` directory files: use `../pages/` for navigation

### SEO Best Practices
- Include game name in title and description
- Use descriptive meta descriptions (150-160 characters)
- Include relevant keywords (game name, genre, platform)
- Use proper heading hierarchy (H1 > H2 > H3 > H4)
- Include internal links between related content
- Add alt text for images
- All pages must include Meta keywords, author, robots, and canonical tags
- All pages must include Open Graph and Twitter Card meta tags
- Add structured data (JSON-LD) for rich search results
- Update sitemap.xml when adding new pages
- Keep favicon.ico and og-image.jpg in root directory

## Design System

### Color Scheme
- **Primary Background:** #0a0e27 (dark blue)
- **Secondary Background:** rgba(30, 35, 60, 0.6-0.8) (dark gray-blue)
- **Accent Colors:** #667eea → #764ba2 (purple-blue gradient)
- **Text Colors:** #e8e8e8 (primary), #a0aec0 (secondary), #718096 (muted)
- **Navigation:** rgba(10, 14, 39, 0.95) with backdrop blur

### Layout Patterns
- **Navbar:** Fixed position, 120px max-width, logo + links
- **Content Grid:** Responsive grid with auto-fill and minmax
- **Cards:** Gradient background, hover effects, border radius 16px
- **Guide Pages:** Two-column layout (main content + sidebar) on desktop, single column on mobile
- **Spacing:** Consistent padding (20px) and margins (1.5-2rem)

### Responsive Breakpoints
- **Desktop:** > 1024px (full layout with sidebar)
- **Tablet:** 768px - 1024px (simplified layout)
- **Mobile:** < 768px (stacked navigation, single column)

## Common Tasks

### Adding a New Game Page
1. Create new HTML file using `game-guide-template.html`
2. Fill in content with game-specific information
3. Optimize meta tags and headings
4. Add internal links from related pages
5. Test in browser
6. Commit and push to update live site

### Updating Navigation
When adding/removing pages, update the navbar in all HTML files:
```html
<div class="nav-links">
    <a href="index.html">Home</a>
    <a href="guides.html">Game Guides</a>
    <a href="tools.html">Tools</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
</div>
```

### Updating Footer Links
Ensure footer navigation is consistent across all pages and includes link to Privacy Policy.

### Testing Changes
1. Open modified files in browser
2. Test navigation between pages
3. Verify responsive design on mobile/tablet/desktop
4. Check for broken links
5. Validate HTML structure
6. Test local server if making changes to interactive elements

## AdSense Integration

### Google Analytics
- All pages include Google Analytics tracking code (G-35CP87Q5L4)
- The tracking script is placed in the `<head>` section, right after the charset meta tag
- Tracks: page views, user engagement, and traffic patterns
- No changes needed for new pages - analytics automatically included in templates

### Ad Placement Strategy
- **Top Banner:** 728x90 above main content
- **In-article:** Between content sections (300x250)
- **Sidebar:** 160x600 in right sidebar (desktop only)
- **Mobile:** Responsive ads that adapt to screen size

### AdSense Requirements
- Privacy policy is required (already implemented)
- Content must be original and provide value
- Site must have substantial content volume
- Ensure ad placements don't negatively impact user experience

## File Naming Conventions

- Main pages: `about.html`, `contact.html`, `privacy.html`, `tools.html`, `guides.html`
- Game guides: `elden-ring-guide.html`, `genshin-impact-builds.html`
- Templates: `game-guide-template.html`
- Use hyphens for multi-word filenames

## Code Style

### HTML
- Use semantic HTML5 elements
- Include lang attribute on html tag
- Use consistent indentation
- Close all tags properly
- Use appropriate alt text for images

### CSS
- Use consistent naming conventions (kebab-case)
- Responsive design with media queries
- CSS in `<style>` blocks within HTML files (no external CSS files)
- Use CSS variables for maintainable color schemes

### JavaScript
- Minimal JavaScript for interactive elements only
- No external dependencies
- Keep scripts at the bottom of body tag
- Use event listeners for interactive features

## Git Workflow

1. Make changes to HTML files
2. Stage files: `git add <filename>`
3. Commit with descriptive message: `git commit -m "Add [game name] guide"`
4. Push to main branch: `git push origin main`
5. Verify deployment at https://woshiliangwenfeng.github.io/

## Testing Checklist

Before committing changes:
- [ ] All navigation links work correctly
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No broken images or links
- [ ] Meta tags are properly set for SEO
- [ ] Privacy policy link works from footer
- [ ] AdSense placeholders are in correct positions
- [ ] Content displays correctly in multiple browsers
- [ ] Page loads quickly (< 3 seconds)
