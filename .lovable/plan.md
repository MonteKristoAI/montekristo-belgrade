

## Make Pricing Page Fully Mobile Responsive

The current pricing page (`public/pricing.html`) has no mobile breakpoints at all. Every section uses fixed 56px padding, 2-column grids, and large font sizes that break on small screens. The wrapper (`Pricing.tsx`) also needs minor mobile adjustments.

### Changes Overview

**1. Add comprehensive mobile media queries to `public/pricing.html`**

Add a `@media (max-width: 640px)` block covering:

- **Cover section**: Reduce padding from 52px/56px to 24px/28px. Scale down the headline (`--t-4xl: 50px`) to ~28px. Hide decorative orbs/rings on small screens. Stack the brand row vertically.
- **Intro section**: Reduce padding from 56px to 20px. Convert the 2-column intro grid to single column.
- **Stats bar**: Reduce padding from 56px to 20px. Switch from 3-column grid to stacked vertical layout with horizontal dividers instead of vertical ones.
- **Section headers/bodies**: Reduce all 56px horizontal padding to 20px.
- **Service card grids**: Switch `.card-grid` from `grid-template-columns: 1fr 1fr` to `1fr` (single column stacking).
- **Feature checklists**: Switch `.feat-grid` and `.bundle-feats` from 2-column to single column.
- **Podcast deliverables**: Switch `.podcast-delivs` from 2-column to single column.
- **Bundle card**: Reduce padding, stack the name/price vertically.
- **Addon table rows**: Stack name/price vertically instead of side-by-side.
- **Notes/footer section**: Reduce padding from 56px to 20px. Stack the footer brand and URL vertically.
- **Service card top row**: When the title + price are too wide, allow wrapping or stack them.

Also add a `@media (max-width: 480px)` for extra-small phones with even smaller fonts and tighter spacing.

**2. Minor update to `src/pages/Pricing.tsx`**

- On mobile, hide the "Services and Pricing 2026" label text to give more room to the back link and PDF button.
- Reduce the control bar padding slightly on mobile.

### Technical Details

All changes are CSS-only additions (no HTML structure changes needed). The responsive rules will be appended after the existing `@media print` block in the `<style>` tag of `pricing.html`. Key breakpoints:

- `max-width: 768px` -- tablet adjustments (reduce padding, smaller fonts)
- `max-width: 640px` -- mobile phone (single-column layouts, stacked elements)
- `max-width: 480px` -- small phones (further font/spacing reductions)

For `Pricing.tsx`, a simple CSS media query will be added inline or via a style tag to handle the top bar on mobile.

