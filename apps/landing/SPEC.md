# ZenPost Landing Page Specification

## Concept & Vision

A confident, editorial-inspired SaaS landing page for a social media management dashboard. The design feels like a premium product magazine — bold typography, generous whitespace, and intentional color accents that guide the eye. The page should feel trustworthy yet innovative, speaking to Indonesian creators and businesses who want professional social media management without complexity.

## Design Language

### Aesthetic Direction
**Editorial SaaS** — Clean magazine-inspired layouts with bold headlines, asymmetric compositions, and a warm yet professional color palette. Think Stripe meets a design publication.

### Color Palette
```css
--background: #FAFAF9        /* Warm white */
--foreground: #18181B        /* Near black */
--muted: #78716C            /* Warm gray */
--muted-foreground: #A8A29E
--primary: #EA580C           /* Burnt orange - distinctive accent */
--primary-foreground: #FFFFFF
--secondary: #1C1917         /* Rich dark */
--secondary-foreground: #FAFAF9
--accent: #F97316            /* Bright orange */
--border: #E7E5E4
--card: #FFFFFF
```

### Typography
- **Headings**: `Space Grotesk` (bold, geometric, distinctive)
- **Body**: `DM Sans` (clean, readable, modern)
- **Accent/Labels**: `JetBrains Mono` (technical feel for stats/metrics)

### Spatial System
- Section padding: `py-24` to `py-32`
- Container max-width: `max-w-6xl`
- Grid gaps: `gap-8` to `gap-16`
- Border radius: `rounded-2xl` for cards, `rounded-full` for buttons

### Motion Philosophy
- Entrance animations: fade-up with stagger (100ms delay between elements)
- Scroll-triggered reveals using Intersection Observer
- Hover states: subtle lift + shadow expansion
- Tab switching: smooth crossfade (300ms)

## Page Structure

### 1. Navbar
Already installed via `@efferd/header-3`. Customize links in `nav-links.tsx`.

### 2. Hero Section
**Layout**: Two-column asymmetric (content left 60%, visual right 40%)
**Content**:
- Badge: "🚀 Early Access - Join 2,847 on waitlist"
- H1: "Kelola Semua Social Media dari Satu Dashboard"
- Subheadline: "Schedule, analytics, dan AI-powered insights untuk creator dan bisnis Indonesia"
- CTA: Email input + "Gabung Waitlist" button
- Social proof: Avatar stack + "Rated 4.9 by users"

**Visual (right)**:
- Floating dashboard screenshot with subtle parallax
- Platform icons floating around (Instagram, TikTok, Twitter, Facebook)

**Tabs below hero**:
- Tab 1: "Analytics" - shows analytics dashboard preview
- Tab 2: "Scheduler" - shows calendar/schedule preview
- Tab 3: "AI Assistant" - shows AI feature preview

### 3. Features Section (3 Cards)
**Layout**: 3-column grid with icons
**Card content**:
1. **Analytics Terpusat** — Lihat semua metric dari satu tempat. Track engagement, followers, dan growth.
2. **Smart Scheduler** — Plan konten mingguan dengan drag-drop. Auto-post ke semua platform.
3. **AI Content Assistant** — Generate caption, hashtag, dan ide konten dengan AI.

### 4. More Features Section
**Layout**: Alternating left-right rows (image + text)
**Features**:
1. Multi-platform support (Instagram, TikTok, Twitter, Facebook, YouTube)
2. Team collaboration (multiple accounts, role permissions)
3. Real-time notifications and engagement inbox

### 5. Comparison Section
**Layout**: Centered table/grid comparing "Manual" vs "ZenPost"
**Points**:
| Manual | ZenPost |
|--------|---------------|
| Login ke 5+ apps | 1 dashboard untuk semua |
| Scroll-scroll-scroll | Auto analytics |
|忘了schedule | Auto-posting |
| Guess-hasil | Data-driven insights |

### 6. Customer Journey Section
**Layout**: 3-step horizontal timeline
**Steps**:
1. **Before**: "Login ke 5 apps, scroll-scroll-scroll, lost track"
   - Visual: Multiple phone icons scattered
2. **During**: "Plan konten mingguan, set once, forget"
   - Visual: Calendar with content blocks
3. **After**: "Dashboard real-time, growth terpantau, audience growing"
   - Visual: Single dashboard with growing chart

### 7. Final CTA Section
**Layout**: Centered with gradient background
**Content**:
- H2: "Siaplevelling up social media game kamu?"
- Subtext: "Join 2,847+ creator dan bisnis yang sudah lebih efficient"
- Email input + CTA button
- Urgency: "⚡ Early bird pricing ends soon"

### 8. Footer
**Layout**: 4-column grid
**Columns**:
1. Brand + tagline
2. Product links
3. Company links
4. Social links

## Component Inventory

### Hero Badge
- Pill shape with gradient background
- Icon + text
- Hover: slight scale up

### Email Input + Button
- Input: rounded-full, border, focus ring
- Button: gradient orange, rounded-full, hover shadow
- States: default, focus, loading (spinner), success (checkmark)

### Feature Card
- White card with subtle border
- Icon in colored circle
- Title + description
- Hover: lift + shadow

### Tab Component
- Horizontal tabs with underline indicator
- Smooth transition between tabs
- Icon + label per tab

### Timeline Step
- Numbered circle
- Connecting line
- Icon + title + description
- Active/inactive states

### Comparison Row
- Two columns with vs badge in middle
- Check/X icons
- Subtle background alternation

## Technical Approach

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 with CSS variables
- **Components**: shadcn/ui + @efferd/header-3
- **Animations**: CSS transitions + Intersection Observer for scroll triggers
- **Font loading**: next/font/google with Space Grotesk, DM Sans, JetBrains Mono

## File Structure
```
src/app/
├── page.tsx          # Main landing page (composed of sections)
├── layout.tsx        # Root layout with fonts
├── globals.css       # Global styles + CSS variables
src/components/
├── header.tsx        # Navbar (from @efferd/header-3)
├── hero.tsx          # Hero section
├── hero-tabs.tsx     # Dashboard preview tabs
├── features.tsx      # 3-card features
├── more-features.tsx # Alternating feature rows
├── comparison.tsx    # Comparison section
├── journey.tsx      # Customer journey timeline
├── cta.tsx          # Final CTA section
├── footer.tsx       # Footer
└── ui/              # shadcn components
```
