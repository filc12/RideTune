# RideTune Official Website Design

## Goal

Build the official RideTune website as the digital identity of a premium motorcycle technology company.

The site must sell confidence, control, comfort, and trust. It should not feel like a generic app landing page or a suspension calculator page. It should feel like a premium product experience comparable in craft to Apple, Garmin, DJI, Nothing, Stripe, and Linear.

## Product Positioning

RideTune is the rider's intelligent setup assistant.

It helps riders find better suspension settings using OEM suspension data, rider weight, passenger and luggage load, riding conditions, diagnostics, ride diary data, tyre pressure guidance, and setup references.

The primary emotional promise is:

Every ride starts with the right setup.

## Visual Direction

Use a Cinematic Premium + Technical Precision direction.

The first impression should be cinematic and confident: full-screen motorcycle photography, a premium phone mockup, large restrained typography, and very little noise. As the user scrolls, the story becomes more technical: OEM data, diagnostics, load calculation, diary, tyre pressure, and premium capabilities.

The site must use the RideTune app language:

- Background: `#070A0F`
- Text: `#F1F5F9`
- Muted text: `#94A3B8` and `#64748B`
- Primary accent: `#3DA9FF`
- Accent surface: `rgba(61,169,255,0.14)`
- Accent border: `rgba(61,169,255,0.35)`
- Success: `#22D08A`
- Warning: `#F4B23E`
- Surface: `rgba(255,255,255,0.04)`
- Elevated surface: `rgba(255,255,255,0.07)`
- Border: `rgba(255,255,255,0.08)` and `rgba(255,255,255,0.14)`

The website should use the same visual grammar as the app: dark surfaces, soft borders, subtle blur, 14px-ish radius, premium blue buttons, restrained technical iconography, and minimal glow.

## Typography

Use Inter as the primary readable font and Space Grotesk or a similar geometric display font for key headlines if available without harming performance.

Headlines should be large, direct, and emotionally confident. Body copy should be short and breathable.

## Page Structure

### 1. Hero

Full-screen first viewport with cinematic motorcycle background, a premium phone mockup, headline, subtitle, Google Play CTA, iPhone coming-soon secondary button, and trust indicators:

- OEM Data
- Ride Diary
- Diagnostics
- Cloud Sync

Headline:

Every ride starts with the right setup.

Subtitle:

RideTune helps you find the perfect motorcycle suspension setup using OEM data, intelligent calculations and real-world riding conditions.

### 2. Problem

Headline:

Your motorcycle isn't the problem.
Your setup is.

Explain that most motorcycles already have excellent suspension, but most riders do not know how to tune it. RideTune makes the decision simple.

Animated problem cards:

- Too much front dive
- Feels unstable
- Harsh over bumps
- Poor traction
- Too soft with luggage

### 3. How It Works

Large elegant timeline:

1. Choose your motorcycle
2. Add rider, passenger and luggage
3. Receive your personalized setup
4. Ride with confidence

Use simple technical icons and minimal supporting text.

### 4. Features

Premium cards with hover interaction:

- OEM Suspension Database
- Smart Load Calculator
- Suspension Recommendations
- Suspension Diagnostics
- Ride Diary
- Tyre Pressure Guide
- SAG Reference
- Cloud Sync
- Premium Features

Cards should feel precise, not decorative.

### 5. Interactive Phone

This is the key product storytelling section.

Use a large sticky phone mockup. While scrolling, the visible app screen changes through:

- Home
- Bike Selection
- Recommendations
- Ride Diary
- Premium

The section should feel product-led, close to Apple-style scroll storytelling. The phone should stay visually stable while labels and screens change.

### 6. RideTune Premium

Elegant Free vs Premium comparison.

Avoid aggressive upselling. Premium should feel aspirational and inevitable.

Premium highlights:

- Unlimited setups
- Ride Diary
- Cloud Sync
- Future AI features
- Priority updates

### 7. Built For Every Ride

Large photography cards:

- Adventure
- Touring
- Sport
- Naked
- Dual Sport
- Commuting
- Weekend rides

Use cinematic motorcycle photography and restrained labels.

### 8. Future

Headline:

This is only the beginning.

Mention continuing evolution:

- More motorcycles
- AI Diagnostics
- Maintenance
- Community
- iPhone version
- Cloud improvements

### Final CTA

Headline:

Every ride starts with the right setup.

CTA:

Download RideTune today.

Primary button:

Download on Google Play

### Footer

Links:

- Privacy
- Terms
- Support
- Contact

## Technical Architecture

Create a standalone Next.js project at:

`/Users/filipecarvalho/Documents/RideTune/website`

Use:

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Semantic HTML
- Responsive design
- Accessible interactive elements
- SEO metadata
- OpenGraph metadata
- JSON-LD structured data

The site should be a single-page product website, implemented through clear components:

- `Hero`
- `Problem`
- `HowItWorks`
- `FeatureGrid`
- `InteractivePhone`
- `Premium`
- `RideTypes`
- `Future`
- `FinalCta`
- `Footer`

## Assets

Prefer real cinematic motorcycle imagery. Avoid cartoon illustration, decorative SVG hero art, generic startup gradients, and stock-looking images.

Use existing RideTune app assets for logo/icon and app-inspired UI mocks where possible. If exact app screenshots are unavailable, create high-fidelity mock screens based on the app visual language.

## Motion

Use Framer Motion for:

- Fade and slight slide entrance
- Soft blur reveals
- Staggered cards
- Sticky phone screen transitions
- Gentle parallax on cinematic images

Motion must be subtle, purposeful, and performance-safe.

Respect reduced-motion preferences.

## SEO And Performance

Requirements:

- Proper heading hierarchy
- Meaningful metadata
- OpenGraph image/metadata
- Schema.org SoftwareApplication JSON-LD
- Optimized images
- Minimal JavaScript where possible
- Lighthouse target above 95 for performance, accessibility, best practices, and SEO

## Acceptance Criteria

- The website feels like RideTune's official premium brand presence, not a generic landing page.
- The hero immediately communicates confidence, quality, and technological trust.
- The visual language clearly extends the app.
- The interactive phone section is the strongest product proof section.
- The site is responsive across mobile, tablet, and desktop.
- Animations are subtle and do not distract.
- SEO metadata and structured data are present.
- The project runs locally and can be deployed independently from the mobile app.
