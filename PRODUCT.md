# Product

## Register

product

## Users

Small friend groups (5-15 people) planning a trip together. Casual, non-technical users on both phone and laptop. They open the app while lounging in a group chat comparing Airbnb links, or standing at a map deciding where things are relative to each other. No accounts, no passwords — whoever has the trip link is trusted and can add/edit/vote.

## Product Purpose

Carovana ("caravan" — a group traveling and deciding together) is a shared trip-planning board. For one trip: drop in candidate accommodations and points of interest (as links or manual pins), see them all plotted on one map, list who's coming, and vote to converge on which place to actually book. Success = the group looks at the map together and picks a place without a 40-message group-chat scroll-fest.

## Brand Personality

Warm, casual, a little playful — a shared trip notebook passed between friends, not a booking platform or project-management tool. Confident but unfussy: the map is the star, chrome stays quiet. Three words: **companionable, direct, unpretentious.**

## Anti-references

- Not Airbnb/Booking.com (glossy marketplace chrome, ratings, pricing psychology)
- Not a SaaS dashboard (KPI cards, sidebars, enterprise density)
- Not generic Google-Maps-blue-pin default styling — pins and map theme should feel designed, not stock
- No login/account gloss (no "sign up", "profile", auth chrome of any kind)

## Design Principles

- Map first — every other panel is a companion to the map, never competes with it for primary screen space
- Zero-friction entry — no auth screens; adding a place, a person, or a vote is one tap away
- Everyone is trusted — no owner/admin hierarchy in the UI; the data model has no permission tiers
- Convergence over collection — voting exists to help the group *decide*, so vote counts and leaders must be immediately legible, not buried
- Works one-handed on a phone in a car, and side-by-side on a laptop while planning

## Accessibility & Inclusion

Best-effort WCAG AA: sufficient contrast, real focus states, touch targets ≥44px, map interactions have non-map fallbacks (list view of every pin), respects `prefers-reduced-motion`. No formal compliance requirement stated by the user — casual friend-group tool, not a public/enterprise surface.
