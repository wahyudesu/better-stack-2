# Landing Page Checklist

## Purpose
Ensure every section of the landing page delivers value and converts visitors into waitlist signups.

---

## Product Identity

**What it is:** ZenPost — social media management dashboard for agencies and businesses in Indonesia.

**Features:**
- Analytics (engagement, followers, ad performance)
- Scheduler (content planning + posting)
- Inbox Management (DM, comment, mention — all platforms in one place)
- Ads Analytics (Google, Meta, TikTok — unified view)
- AI Analytics (insights, caption suggestion, content ideas)

**Target users:**
- Agency owners (manage multiple clients)
- Business owners (handle own brand)
- Social media managers (work at a company)
- Freelance creators

**Pain points solved:**
1. Reporting eats 5-10 hours/month per client
2. Must open 5+ different platforms for monitoring
3. Inbox scattered across email, DM, comment, mention
4. Ads data fragmented — no unified view to prove ROI

**Tagline:** "Every metrics. Every channel. One dashboard."
**Hero (pain-driven):** "Stop juggling 5 platforms. All your social media metrics—finally in one place."

---

## 1. Instant Clarity
**Goal:** Visitor understands offer in < 3 seconds.

- [ ] Hero headline is pain-driven, not vague ("Stop juggling 5 platforms..." not just "Boost your growth")
- [ ] Subheadline explains: analytics + scheduler + inbox + ads + AI, in one dashboard, for Indonesia
- [ ] Visual hierarchy: headline → waitlist form (2 fields: email + user type) → product tabs
- [ ] No jargon in hero section
- [ ] Badge: "Early access" signals momentum

**Red flag:** "We help you grow" without specifics.

---

## 2. Value Proposition
**Goal:** Visitor sees why this product is worth their time.

**Core message:** Everything you need to manage social media—in one place.

**Benefit priority order:**
1. Analytics — "Pantau semua metrik—engagement, followers, dan performa iklan—sekaligus tanpa switch platform."
2. Inbox — "Semua DM, comment, dan mention—handle dalam satu inbox. Nggak perlu buka 5 tab lagi."
3. Ads — "View performa semua iklan dari Google, Meta, TikTok—sekaligus. Tau mana yang convert."
4. (Below fold) Scheduler — content planning
5. (Below fold) AI — insights + caption suggestion

**Checklist:**
- [ ] Clear problem statement in hero
- [ ] 3 benefits in scannable format (Analytics, Inbox, Ads)
- [ ] Unique differentiator: unified dashboard, not yet another point solution
- [ ] Benefits tied to outcomes (save time, prove ROI, handle conversations faster)
- [ ] No feature list without context

**Red flag:** "We have AI, scheduling, analytics, inbox" without connecting to user pain.

---

## 3. Call to Actions
**Goal:** Visitor knows exactly what to do next at every stage.

- [ ] Primary CTA: "Get Early Access" — action verb + value
- [ ] Waitlist form: 2 fields (email + user type dropdown) — simple, low friction
- [ ] CTA repeated at end of hero section
- [ ] Loading state shows "Joining..." during submission
- [ ] Success state shows confirmation message
- [ ] Error state shows clear message (email required, invalid format, etc.)

**User type dropdown options:**
```
- Agency Owner (manage multiple clients)
- Business Owner (handle your own brand)
- Social Media Manager
- Freelance Creator
```

**Red flag:** "Contact us" or "Learn more" as primary CTA.

---

## 4. Smooth Storyline
**Goal:** Visitor flows from problem → solution → proof without confusion.

**Story sequence:**
1. **Hook** — Pain point: "Stop juggling 5 platforms"
2. **Problem** — What hurts: fragmented tools, wasted time, no unified view
3. **Solution** — ZenPost: all-in-one dashboard
4. **How It Works** — 3 steps: Connect → View all metrics → Generate reports
5. **Features Breakdown** — Analytics → Inbox → Scheduler → Ads → AI
6. **Benefits** — Save time, prove ROI, respond faster
7. **Social Proof** — You handle sendiri (waitlist count, testimonials, trust badges)
8. **CTA** — "Get Early Access"

**Checklist:**
- [ ] Hero sets up the pain
- [ ] Feature tabs follow priority: Analytics → Inbox → Scheduler → Ads → AI
- [ ] Each section leads into next (no abrupt jumps)
- [ ] Every section connects back to CTA
- [ ] Progressive disclosure: light upfront, deeper below fold

**Red flag:** Sections contradict or jump out of logical order.

---

## 5. Social Proof
**Goal:** Visitor trusts the product and team.

**You handle sendiri, but recommended approach:**
- [ ] Early access badge (you already have this)
- [ ] Waitlist count: "500+ social media managers waiting" (when available)
- [ ] Quote/testimonial (even placeholder from beta tester)
- [ ] "Built for Indonesian agencies and businesses"
- [ ] Product screenshots (dashboard preview)

**Red flag:** Generic "loved by thousands" without specifics.

---

## 6. Great Design
**Goal:** Landing page looks professional and builds trust.

- [ ] Consistent color palette and typography throughout
- [ ] Sufficient whitespace — no cluttered sections
- [ ] Visual hierarchy guides eye movement
- [ ] Product preview tabs show 5 features: Analytics, Inbox, Scheduler, Ads, AI
- [ ] Tab labels short and scannable
- [ ] Mobile-first layout — content stacks vertically on small screens
- [ ] No broken images or placeholder graphics
- [ ] Footer complete (links, copyright, social)

**Red flag:** Misaligned elements, inconsistent spacing, unreadable text on mobile.

---

## 7. Fast Mobile Optimized Performance
**Goal:** Page loads fast on mobile, no janky experience.

- [ ] Images use Next.js Image with `sizes` prop (800px max width)
- [ ] No large unoptimized assets above the fold
- [ ] Lazy loading on below-fold images (`loading="lazy"`)
- [ ] CSS bundled efficiently (Tailwind v4)
- [ ] No render-blocking scripts
- [ ] Touch targets minimum 44px (form inputs, buttons)
- [ ] Form is thumb-friendly on mobile (2 fields stacked vertically)
- [ ] Lighthouse mobile performance target: 90+

**Red flag:** Images larger than necessary, no lazy loading, poor mobile responsiveness.

---

## Quick Audit Script

1. Open page on mobile. "Stop juggling 5 platforms" — do you get it in < 3 seconds? → **Instant Clarity**
2. Can you list 3 main benefits without looking? (Analytics, Inbox, Ads) → **Value Proposition**
3. Where do you click? "Get Early Access" button visible? → **Call to Actions**
4. Does the page feel like story: pain → solution → features → CTA? → **Smooth Storyline**
5. Do you trust it? Early access badge? Dashboard preview? → **Social Proof**
6. Does it look professional? → **Great Design**
7. Does it load fast and work on mobile? → **Fast Mobile Optimized Performance**

---

## Conversion Threshold

| Metric | Target |
|--------|--------|
| Hero scroll-through to tabs | > 40% |
| Waitlist form submission rate | > 5% of visitors |
| User type distribution (for segmentation) | Track agency vs business vs smm vs freelance |
| Mobile performance score | > 85 (Lighthouse) |
| Time to understand offer | < 3 seconds |