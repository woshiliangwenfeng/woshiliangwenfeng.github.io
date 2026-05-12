# AdSense Setup Guide

This guide explains how to integrate Google AdSense into the G Hub website.

## Ad Placement Strategy

### 1. Top Banner (728x90)
**Position:** Above main content, below game header
**Purpose:** High visibility, first thing users see
**Device:** Desktop and Tablet (hidden on mobile)

### 2. In-Article Units (300x250)
**Position:** Between content sections (after 2-3 paragraphs)
**Purpose:** High engagement, less intrusive
**Device:** All devices

### 3. Sidebar Ads (160x600)
**Position:** Right sidebar below navigation
**Purpose:** Continuous visibility during reading
**Device:** Desktop and Tablet only

### 4. Bottom Banner (728x90)
**Position:** Below main content, before footer
**Purpose:** Final CTA opportunity
**Device:** All devices

## AdSense Account Setup

### Before Adding Ads to Site
1. **Create AdSense Account**
   - Visit https://adsense.google.com/
   - Sign in with your Google account
   - Complete payment profile setup

2. **Add Your Website**
   - Go to "Sites" in AdSense dashboard
   - Click "Add site"
   - Enter your site URL: `https://woshiliangwenfeng.github.io/`

3. **Get Your Ad Code**
   - Wait for site review (usually 1-2 days)
   - Once approved, go to "Ads" → "Get ad code"
   - Copy the ad unit code for each placement

### Ad Unit Naming Convention
- `adsense-top-banner` - Top 728x90 banner
- `adsense-in-article` - In-article 300x250 units
- `adsense-sidebar` - Sidebar 160x600 unit
- `adsense-bottom-banner` - Bottom 728x90 banner

## Implementation Instructions

### Step 1: Add AdSense Script to Head
Add this script to the `<head>` section of all pages, replacing `YOUR-ADSENSE-ID` with your actual AdSense ID:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=YOUR-ADSENSE-ID"
     crossorigin="anonymous"></script>
```

### Step 2: Replace Ad Placeholders
Replace the ad placeholder divs in HTML files with actual AdSense ad unit codes:

**Example for top banner:**
```html
<!-- Original placeholder -->
<div class="ad-placeholder">
    📱 AdSense Top Banner (728x90)
    <span>Place your top banner ad code here</span>
</div>

<!-- Replace with actual ad code -->
<div class="ad-unit top-banner">
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="YOUR-ADSENSE-ID"
         data-ad-slot="YOUR-AD-SLOT-ID"
         data-ad-format="horizontal"
         data-full-width-responsive="true"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</div>
```

### Step 3: Add Responsive Ad CSS
Add this CSS to ensure ads display correctly:

```css
.ad-unit {
    margin: 2rem auto;
    text-align: center;
    min-height: 90px;
    background: rgba(30, 35, 60, 0.4);
    border: 1px dashed rgba(102, 126, 234, 0.3);
    border-radius: 8px;
    padding: 1.5rem;
}

.ad-unit.ins {
    background: rgba(30, 35, 60, 0.4);
    border: 1px dashed rgba(102, 126, 234, 0.3);
    border-radius: 8px;
    padding: 1rem;
    margin: 2rem 0;
}

/* Hide large ads on mobile */
@media (max-width: 768px) {
    .ad-unit.top-banner,
    .ad-unit.bottom-banner {
        display: none;
    }
    
    /* Adjust in-article ads for mobile */
    .ad-unit.ins {
        margin: 1.5rem 0;
        padding: 1rem;
    }
}

/* Show sidebar ads only on desktop */
@media (max-width: 1024px) {
    .sidebar .ad-unit {
        display: none;
    }
}
```

## AdSense Policy Requirements

### Content Requirements
- **Original Content:** All content must be original and provide value
- **Text Volume:** Substantial text content (2000+ words per guide)
- **Regular Updates:** Add new content regularly
- **User Value:** Content should help users solve problems

### Technical Requirements
- **Privacy Policy:** Must include privacy policy (✅ Already implemented)
- **Terms of Service:** Optional but recommended
- **Contact Information:** Must provide contact method (✅ Already implemented)
- **Site Navigation:** Clear and accessible (✅ Already implemented)
- **Loading Speed:** Fast page load times (< 3 seconds)

### Traffic Requirements
- **Minimum Traffic:** Usually 50-100 daily visitors to get approved
- **Geographic Targeting:** Site serves US/Europe (✅ Matches our audience)
- **Quality Traffic:** Organic search traffic preferred

## Ad Placement Best Practices

### Do's
- ✅ Place ads in natural content breaks
- ✅ Use responsive ad units
- ✅ Test different ad positions
- ✅ Monitor performance in AdSense dashboard
- ✅ Follow AdSense program policies

### Don'ts
- ❌ Don't place too many ads on a single page (max 3-4)
- ❌ Don't place ads above the fold without content
- ❌ Don't use deceptive ad placements
- ❌ Don't click your own ads
- ❌ Don't modify ad code

## Performance Monitoring

### Key Metrics to Track
- **RPM (Revenue Per 1000 Impressions):** Track earning efficiency
- **CTR (Click-Through Rate):** Monitor ad engagement
- **CPC (Cost Per Click):** Understand ad value
- **Page Views:** Measure overall site traffic

### Optimization Tips
- **A/B Testing:** Try different ad positions
- **Content Optimization:** Better content = better ad performance
- **User Experience:** Don't sacrifice UX for ad revenue
- **Mobile Optimization:** Focus on mobile ad performance (60%+ traffic)

## Troubleshooting

### Common Issues
- **Ads not showing:** Check if site is approved in AdSense
- **Low revenue:** Improve content quality and traffic
- **Policy violations:** Review AdSense policies regularly
- **Technical errors:** Check browser console for script errors

### Testing Ad Units
Before going live:
1. Test ad code in browser
2. Check console for errors
3. Verify ads display on different devices
4. Test ad blocking software compatibility

## Next Steps

1. ✅ Privacy policy is implemented
2. ✅ Site has substantial content
3. ⏳ Create AdSense account
4. ⏳ Submit site for review
5. ⏳ Wait for approval (1-2 days)
6. ⏳ Add ad code to pages
7. ⏳ Monitor performance and optimize

## File Update Checklist

When adding AdSense to the website, update these files:
- [ ] `index.html` - Add top banner and bottom banner ads
- [ ] `guides.html` - Add top banner ads
- [ ] `tools.html` - Add top banner ads
- [ ] `about.html` - Add top banner ads
- [ ] `contact.html` - Add top banner ads
- [ ] `privacy.html` - Add top banner ads
- [ ] `game-guide-template.html` - Add all ad placements
- [ ] `elden-ring-beginner-guide.html` - Add all ad placements
- [ ] Create new guide pages with ad placements

## Contact

For AdSense-related questions or issues, check:
- AdSense Help Center: https://support.google.com/adsense
- AdSense Policy Center: https://support.google.com/adsense/answer/48182
