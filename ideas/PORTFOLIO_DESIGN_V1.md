# Vidun Portfolio — V1 Design Document

> A creative, professional software-engineering portfolio built around modern
> neobrutalism, smooth motion, strong typography, interactive project
> storytelling, and a secure content-management system.

---

# 1. Project Vision

The portfolio should not feel like a traditional developer resume website.

It should feel like a **small software product** that demonstrates:

- Software engineering
- UI/UX understanding
- Full-stack development
- Mobile development
- Systems/infrastructure knowledge
- Game development
- Modern frontend architecture
- Backend architecture
- Security practices
- Animation and interaction design

The visual direction is inspired by the provided reference image:

- Neobrutalist UI
- Cream background
- Thick dark borders
- Offset shadows
- Large typography
- Bright accent colors
- Floating decorative elements
- Asymmetrical layouts
- Strong visual hierarchy

However, the final design should be more technically oriented and unique to a
software engineer.

---

# 2. Design Philosophy

## Core Concept

> **"A software engineer's portfolio designed like a product."**

The site should balance:

```text
              PROFESSIONAL
                    ▲
                    │
                    │
TECHNICAL ◄─────────┼─────────► CREATIVE
                    │
                    │
                    ▼
                 PLAYFUL
```

The site should NOT feel:

- Corporate
- Generic
- Like a resume template
- Like a generic SaaS dashboard
- Excessively cyberpunk
- Excessively dark
- Childish
- Over-animated

The desired feeling is:

> **Professional + Technical + Creative + Memorable**

---

# 3. Design Reference

Primary visual reference:

https://www.neobrutalism.dev/

The component system should use the Neobrutalism ecosystem wherever
appropriate rather than recreating common UI primitives from scratch.

The design should leverage:

- Neobrutalist buttons
- Cards
- Inputs
- Dialogs
- Forms
- Tabs
- Navigation
- Badges
- Tables
- Selects
- Drawers
- Toasts
- Other available primitives

Custom portfolio-specific components should be built on top of these primitives.

---

# 4. Technology Direction

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Neobrutalism UI
- shadcn/ui / Base UI where appropriate

## Animation

Primary:

- Framer Motion / Motion

Secondary:

- GSAP
- GSAP ScrollTrigger

Animation should be used intentionally.

Recommended division:

```text
Framer Motion
    ↓
UI interactions
Page transitions
Cards
Buttons
Menus
Micro-interactions
Entrance animations

GSAP
    ↓
Hero animations
Complex scroll animations
Pinned sections
Large timeline animations
Advanced project storytelling
```

## Backend

- Next.js Server Components
- Server Actions / Route Handlers
- PostgreSQL
- Supabase

## Authentication

- Supabase Auth

## Storage

- Supabase Storage

## Validation

- Zod

## Forms

- React Hook Form

## Deployment

- Vercel
- Supabase

---

# 5. Color System

## Primary Background

```text
Cream
#FFF8EF
```

## Primary

```text
Blue
#8EA7FF
```

## Secondary

```text
Teal
#65D6C1
```

## Accent

```text
Pink
#FF4FA3
```

## Highlight

```text
Yellow
#FFD34D
```

## Dark

```text
#171717
```

## White

```text
#FFFFFF
```

## Success

```text
#55E88A
```

## Error

```text
#FF6464
```

---

# 6. Color Usage Rules

The site should primarily use:

```text
Cream
+
Black
+
White
```

Accent colors should be used strategically.

Example:

```text
Yellow
→ Primary CTA

Blue
→ Hero / information

Teal
→ Technology / systems

Pink
→ Creative highlights

Green
→ Status / success
```

Avoid making every card a different color.

Color should create hierarchy rather than noise.

---

# 7. Typography

## Primary Font

Recommended:

```text
Space Grotesk
```

Alternative:

```text
Geist
```

or

```text
Plus Jakarta Sans
```

## Heading Style

Very bold.

Example:

```text
I BUILD

SOFTWARE

THAT WORKS.
```

Desktop:

```text
72px – 110px
```

Tablet:

```text
56px – 72px
```

Mobile:

```text
40px – 52px
```

Body:

```text
16px – 18px
```

Metadata:

```text
12px – 14px
```

---

# 8. Neobrutalist Design Rules

## Borders

Default:

```text
2px solid #171717
```

Important elements:

```text
3px solid #171717
```

## Shadows

Default:

```text
6px 6px 0 #171717
```

Large:

```text
8px 8px 0 #171717
```

## Border Radius

Use moderate radius:

```text
8px
12px
16px
```

Avoid excessive pill-shaped UI.

Pills should be reserved for:

- Status
- Technology badges
- Small labels
- Availability indicators

---

# 9. Motion Design Philosophy

Animations should make the interface feel alive without slowing down the user.

Primary principle:

> **Motion should explain hierarchy, interaction, and navigation.**

Not:

> "Animate everything because we can."

---

# 10. Motion System

## Fast

```text
150ms – 200ms
```

Used for:

- Buttons
- Hover states
- Small UI interactions

## Normal

```text
250ms – 400ms
```

Used for:

- Cards
- Navigation
- Menus
- Content entrances

## Slow

```text
600ms – 1000ms
```

Used for:

- Hero
- Major section transitions
- Large illustrations

## Cinematic

```text
1000ms – 1800ms
```

Used rarely for:

- Hero intro
- Project storytelling
- Major scroll transitions

---

# 11. Animation Principles

Animations should generally use:

```text
opacity
transform
scale
rotate
clip-path
```

Avoid animating expensive layout properties when possible.

Prefer:

```text
transform
```

over:

```text
top
left
width
height
```

for animations.

---

# 12. Page Entrance

On initial page load:

```text
Background
     ↓
Navigation
     ↓
Hero label
     ↓
Hero heading
     ↓
Hero description
     ↓
Hero buttons
     ↓
Hero visual
```

Use a staggered entrance.

Example:

```text
0ms
Background

100ms
Navigation

200ms
Hero label

300ms
Heading

450ms
Description

550ms
Buttons

700ms
Hero visual
```

The animation should be subtle and fast enough that the user can immediately
interact with the page.

---

# 13. Navigation Concept

Instead of:

```text
Home | About | Skills | Projects | Experience | Contact
```

use a more creative navigation.

Example:

```text
VIDUN.DEV

[ BUILD ] [ STACK ] [ WORK ] [ JOURNEY ] [ SAY HI ]
```

Possible mapping:

```text
BUILD
  → About

STACK
  → Skills

WORK
  → Projects

JOURNEY
  → Experience

SAY HI
  → Contact
```

The actual section IDs can remain semantic:

```text
#home
#about
#skills
#projects
#experience
#contact
```

---

# 14. Navigation Animation

Desktop:

The navigation is initially positioned normally.

After scrolling:

```text
Top navigation
      ↓
Transforms into
floating neobrutalist bar
```

Example:

```text
┌───────────────────────────────────────────────┐
│ VIDUN.DEV   BUILD  STACK  WORK  JOURNEY  HI │
└───────────────────────────────────────────────┘
             █████████████████
```

Use:

- Framer Motion
- Backdrop blur
- Slight scale
- Shadow
- Border

Navigation should not constantly bounce or move.

---

# 15. HOME — "THE ENTRY POINT"

## Purpose

Immediately communicate:

1. Who I am
2. What I build
3. What technologies I use
4. Where to explore next

## Hero

Example:

```text
HI, I'M VIDUN.

I BUILD
SOFTWARE
THAT WORKS.
```

Supporting text:

```text
Software Engineering Student
Building web applications, mobile apps,
systems and experimental products.
```

Buttons:

```text
[ EXPLORE MY WORK → ]

[ LET'S TALK ]
```

---

# 16. Hero Visual

Instead of a normal profile image card, create a large interactive
developer-oriented composition.

Example:

```text
                 ┌───────────────┐
                 │   { }         │
                 │               │
                 │   VIDUN       │
                 │   DEV         │
                 │               │
                 └───────────────┘

        < / >                    git

               ┌──────────────┐
               │              │
               │  PROFILE     │
               │  VISUAL      │
               │              │
               └──────────────┘

     API                           01
```

Decorative elements:

```text
{ }
</>
01
404
git
npm
API
DB
localhost
```

These elements can gently float.

---

# 17. Hero Animation

Use GSAP for the large hero composition.

Animations:

### Floating Elements

Each decorative object receives slightly different:

```text
duration
rotation
movement
delay
```

Example:

```text
Element A
y: ±8px

Element B
rotation: ±4deg

Element C
x: ±12px
```

Animations should be continuous but extremely subtle.

---

# 18. Hero Mouse Interaction

Desktop only.

The hero composition can react slightly to the mouse.

Example:

```text
Mouse moves right
       ↓
Hero objects move slightly right

Mouse moves up
       ↓
Objects move slightly up
```

Maximum movement:

```text
5px – 15px
```

Never make it feel like a game.

---

# 19. HOME — "WHAT I BUILD"

Instead of "What I Can Do For You", use:

# WHAT I BUILD

Subtitle:

```text
A few things I like turning into working software.
```

Four cards:

```text
01
FULL STACK

02
MOBILE

03
SYSTEMS

04
GAME DEV
```

---

# 20. Creative Capability Cards

Each card should have a different visual identity.

## Full Stack

Color:

```text
Blue
```

Visual:

```text
</>
API
DB
```

Animation:

```text
Code symbols shift slightly
```

## Mobile

Color:

```text
Yellow
```

Visual:

```text
┌────────────┐
│            │
│    APP     │
│            │
└────────────┘
```

Animation:

```text
Phone rises slightly on hover.
```

## Systems

Color:

```text
Teal
```

Visual:

```text
SERVER
  │
  ├── API
  │
  ├── DB
  │
  └── NETWORK
```

Animation:

```text
Connection lines animate.
```

## Game Development

Color:

```text
Pink
```

Visual:

```text
PLAYER
  ↓
WORLD
  ↓
SYSTEM
```

Animation:

```text
Small game-like movement.
```

---

# 21. Scroll Animation — Capability Cards

When the section enters the viewport:

```text
Card 1
     ↓
Card 2
     ↓
Card 3
     ↓
Card 4
```

Cards should stagger in.

On hover:

```text
translate(-3px, -3px)
shadow increases
```

Clicking a capability can scroll to relevant projects.

---

# 22. ABOUT — "WHO'S BEHIND THE CODE?"

Instead of simply calling the section:

```text
ABOUT
```

Display:

# WHO'S BEHIND THE CODE?

Possible subtitle:

```text
A developer who likes understanding how things actually work.
```

---

# 23. Creative About Layout

Split screen:

```text
┌──────────────────────┬──────────────────────────┐
│                      │                          │
│   PROFILE VISUAL     │  WHO AM I?               │
│                      │                          │
│   [IMAGE / ART]      │  Short introduction      │
│                      │                          │
│                      │  Interests               │
│                      │                          │
└──────────────────────┴──────────────────────────┘
```

Decorative labels:

```text
CURRENTLY BUILDING
ALWAYS LEARNING
CURIOUS ABOUT
```

---

# 24. About Interactive Elements

Possible small cards:

```text
CURRENTLY BUILDING
↓

Production applications


EXPLORING
↓

AI
Systems
Game Development


I LIKE
↓

Clean architecture
Good UX
Automation
```

Cards can rotate by 1–2 degrees.

On hover they straighten.

---

# 25. SKILLS — "MY TOOLBOX"

Instead of a normal skill list:

# MY TOOLBOX

Subtitle:

```text
The tools I use to turn ideas into software.
```

---

# 26. Skill Visualization

Organize skills by category.

```text
LANGUAGES

TypeScript
Python
C
C++
C#
```

```text
FRONTEND

React
Next.js
React Native
Tailwind
```

```text
BACKEND

Node.js
APIs
Authentication
```

```text
DATABASE

PostgreSQL
Supabase
Prisma
```

```text
TOOLS

Git
Docker
Linux
VS Code
```

---

# 27. Creative Skills Interaction

Skills should not simply be logos.

When hovering a technology:

```text
┌──────────────────────┐
│ NEXT.JS              │
│                      │
│ React framework      │
│ used for...          │
│                      │
│ ███████████████      │
└──────────────────────┘
```

The card can:

```text
rotate
translate
expand
```

slightly.

---

# 28. Skills Filtering

Allow users to filter:

```text
[ ALL ]

[ LANGUAGES ]

[ FRONTEND ]

[ BACKEND ]

[ MOBILE ]

[ DATABASE ]

[ TOOLS ]
```

Filter changes should animate with Framer Motion's layout animations.

---

# 29. PROJECTS — "THINGS I'VE BUILT"

This should be the visual centerpiece of the portfolio.

Instead of:

```text
PROJECTS
Project 1
Project 2
Project 3
```

use:

# THINGS I'VE BUILT

Subtitle:

```text
Some experiments became products.
Some products became lessons.
```

---

# 30. Featured Project

One project gets a large presentation.

```text
┌─────────────────────────────────────────────────────┐
│                                                     │
│                  PROJECT IMAGE                      │
│                                                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ AUDITFLOW                                           │
│                                                     │
│ Compliance management platform                      │
│                                                     │
│ Next.js • Prisma • PostgreSQL • Supabase             │
│                                                     │
│ [ CASE STUDY → ]                 [ GITHUB ↗ ]       │
└─────────────────────────────────────────────────────┘
```

---

# 31. Project Card Animation

On hover:

```text
Image
    ↓
slight scale: 1.03

Card
    ↓
translate(-4px, -4px)

Shadow
    ↓
increase
```

Technology badges remain stable.

Do not scale the entire card aggressively.

---

# 32. Project Scroll Story

For featured projects, use GSAP ScrollTrigger.

Example:

```text
PROJECT
   │
   ▼
IMAGE
   │
   ▼
PROBLEM
   │
   ▼
SOLUTION
   │
   ▼
ARCHITECTURE
   │
   ▼
RESULT
```

A large project visual can remain pinned while text changes beside it.

Desktop only.

On mobile, convert this into normal scrolling.

---

# 33. Project Detail Pages

URL:

```text
/projects/[slug]
```

Structure:

```text
PROJECT TITLE

One sentence description

Hero image

Overview

Problem

Solution

Features

Architecture

Technology

Challenges

Lessons

Screenshots

Links
```

---

# 34. EXPERIENCE — "THE JOURNEY"

Do not display a boring CV timeline.

Use:

# THE JOURNEY

Subtitle:

```text
Where I've been, what I've learned,
and what I'm building next.
```

---

# 35. Creative Experience Timeline

Example:

```text
2026
        ●
        │
        ├── IT JUNIOR EXECUTIVE
        │
        │   Building systems
        │   Solving problems
        │   Learning from production
        │
2025    ●
        │
        ├── IT INTERNSHIP
        │
        │
2024    ●
        │
        └── SOFTWARE ENGINEERING
```

---

# 36. Experience Animation

As the user scrolls:

```text
Timeline line
      ↓
grows vertically
```

Experience cards appear when the timeline reaches them.

Use GSAP ScrollTrigger.

Example:

```text
scroll
 ↓
timeline grows
 ↓
year appears
 ↓
card slides in
 ↓
technology badges appear
```

---

# 37. CONTACT — "LET'S BUILD SOMETHING"

Do not call it simply:

```text
CONTACT
```

Instead:

# LET'S BUILD SOMETHING.

Supporting text:

```text
Have an idea, project, question,
or just want to say hello?
```

---

# 38. Contact Visual

Large final section:

```text
┌───────────────────────────────────────────────┐
│                                               │
│ LET'S BUILD                                   │
│ SOMETHING.                                    │
│                                               │
│ [ YOUR NAME ]                                 │
│                                               │
│ [ EMAIL ]                                     │
│                                               │
│ [ MESSAGE ]                                   │
│                                               │
│              [ SEND MESSAGE → ]               │
│                                               │
└───────────────────────────────────────────────┘
```

---

# 39. Contact Interaction

Submit button:

Normal:

```text
SEND MESSAGE →
```

During submission:

```text
SENDING...
```

Success:

```text
MESSAGE SENT ✓
```

Use a small animated state transition.

Do not use annoying full-screen animations.

---

# 40. Footer

Footer should be small but memorable.

Example:

```text
VIDUN.DEV

Built with curiosity,
TypeScript and too much coffee.

[ GitHub ]
[ LinkedIn ]
[ Email ]

© 2026 Vidun
```

Potential decorative element:

```text
┌───────────────────┐
│ STATUS: BUILDING  │
│                   │
│ ● ONLINE          │
└───────────────────┘
```

---

# 41. Complete Public Site Structure

```text
/
│
├── HOME
│   └── The Entry Point
│
├── ABOUT
│   └── Who's Behind the Code?
│
├── SKILLS
│   └── My Toolbox
│
├── PROJECTS
│   ├── Featured Project
│   ├── Project Grid
│   └── Project Details
│
├── EXPERIENCE
│   └── The Journey
│
├── CONTACT
│   └── Let's Build Something
│
└── FOOTER
```

Visual navigation:

```text
BUILD
STACK
WORK
JOURNEY
SAY HI
```

Semantic section IDs:

```text
#home
#about
#skills
#projects
#experience
#contact
```

---

# 42. Admin Panel

The admin panel must use the same visual language as the public site.

It should NOT look like a generic dashboard template.

---

# 43. Admin Layout

```text
┌────────────────────────────────────────────────────┐
│ VIDUN.DEV ADMIN                      VIDUN  ●      │
├────────────────┬───────────────────────────────────┤
│                │                                   │
│ DASHBOARD      │      GOOD MORNING, VIDUN.         │
│                │                                   │
│ PROJECTS       │      ┌──────┐ ┌──────┐           │
│ SKILLS         │      │  12  │ │  8   │           │
│ EXPERIENCE     │      │PROJECT│ │PUBLISHED         │
│ ABOUT          │      └──────┘ └──────┘           │
│ MEDIA          │                                   │
│ MESSAGES       │      RECENT ACTIVITY              │
│ ACTIVITY       │                                   │
│ SETTINGS       │      ...                          │
└────────────────┴───────────────────────────────────┘
```

---

# 44. Admin Dashboard Cards

Statistics:

```text
PROJECTS
12

PUBLISHED
8

DRAFTS
4

MESSAGES
5
```

Each card should have a small visual identity.

---

# 45. Project Management

Admin:

```text
PROJECTS

[ + NEW PROJECT ]

┌──────────────────────────────────────────────┐
│ PROJECT       STATUS       UPDATED     ACTION │
├──────────────────────────────────────────────┤
│ AuditFlow     PUBLISHED    Today       EDIT   │
│ Creasy Eco    PUBLISHED    Yesterday   EDIT   │
│ OTFlow        DRAFT        Sep 29      EDIT   │
└──────────────────────────────────────────────┘
```

---

# 46. Project Editor

Fields:

```text
Title
Slug
Description
Category
Technologies
Hero Image
Gallery
GitHub URL
Live URL
Download URL
Featured
Status
Sort Order
```

Optional case-study fields:

```text
Problem
Solution
Features
Architecture
Challenges
Lessons Learned
Results
```

---

# 47. Skills Management

Admin can manage:

```text
Technology Name
Category
Icon
Description
Featured
Sort Order
```

---

# 48. Experience Management

Admin can create:

```text
Company
Position
Start Date
End Date
Description
Technologies
Achievements
Sort Order
```

---

# 49. About Management

Editable:

```text
Headline
Bio
Interests
Currently Building
Currently Learning
Profile Image
Location
Availability
```

---

# 50. Media Manager

```text
MEDIA

[ UPLOAD ]

┌────────┐ ┌────────┐ ┌────────┐
│ IMAGE  │ │ IMAGE  │ │ IMAGE  │
│        │ │        │ │        │
└────────┘ └────────┘ └────────┘
```

Storage structure:

```text
portfolio/
│
├── profile/
├── projects/
├── screenshots/
└── documents/
```

---

# 51. Contact Messages

Admin:

```text
MESSAGES

┌──────────────────────────────────────────────┐
│ NAME       EMAIL          STATUS             │
├──────────────────────────────────────────────┤
│ John       john@...       NEW                │
│ Sarah      sarah@...      READ               │
└──────────────────────────────────────────────┘
```

Message detail:

```text
FROM
John Doe

EMAIL
john@example.com

MESSAGE
...

[ MARK AS READ ]

[ DELETE ]
```

---

# 52. Activity Log

Track:

```text
LOGIN
LOGOUT

PROJECT_CREATED
PROJECT_UPDATED
PROJECT_DELETED
PROJECT_PUBLISHED

SKILL_CREATED
SKILL_UPDATED

MEDIA_UPLOADED

MESSAGE_RECEIVED
```

Example:

```text
VIDUN

Published:
"AuditFlow"

Today — 13:02
```

---

# 53. Database Architecture

Initial entities:

```text
AdminUser

Profile

SiteSettings

Project

ProjectTechnology

Technology

ProjectMedia

Experience

Education

SocialLink

Media

ContactMessage

ActivityLog
```

---

# 54. Project Relationships

```text
Project
 │
 ├── ProjectTechnology
 │       │
 │       └── Technology
 │
 ├── ProjectMedia
 │       │
 │       └── Media
 │
 └── ProjectContent
```

---

# 55. Content Publishing

Projects should support:

```text
DRAFT
PUBLISHED
ARCHIVED
```

Public site only displays:

```text
PUBLISHED
```

Workflow:

```text
CREATE
  ↓
DRAFT
  ↓
EDIT
  ↓
PREVIEW
  ↓
PUBLISH
```

---

# 56. Authentication Architecture

Admin:

```text
/admin/login
```

Flow:

```text
Admin
  ↓
Supabase Auth
  ↓
Session
  ↓
Middleware / Server Authorization
  ↓
Admin Route
```

Never expose service-role credentials to the browser.

---

# 57. Authorization

V1:

```text
ADMIN
```

Future:

```text
ADMIN
EDITOR
VIEWER
```

All sensitive operations must be server-side.

---

# 58. Database Security

Use Supabase Row Level Security.

Public:

```text
SELECT published content
```

Admin:

```text
CREATE
READ
UPDATE
DELETE
PUBLISH
```

Sensitive credentials must remain server-side.

---

# 59. Validation

All external input should be validated.

Use:

```text
Zod
```

Examples:

```text
ProjectSchema
SkillSchema
ExperienceSchema
ContactSchema
ProfileSchema
```

Never trust client-side validation alone.

---

# 60. Contact Form Security

Contact form should include:

```text
Validation
Rate limiting
Spam protection
Input sanitization
Server-side processing
```

Potential future:

```text
Cloudflare Turnstile
```

---

# 61. Security Requirements

The application should include:

- Secure authentication
- Authorization
- RLS
- Server-side mutations
- Environment variables
- Input validation
- Rate limiting
- Security headers
- Secure cookies
- Error handling
- No secret keys in client bundles
- File upload validation
- File size limits
- MIME type validation
- Activity logging

---

# 62. File Upload Security

Only allow approved file types.

Example:

```text
JPEG
PNG
WEBP
SVG
PDF
```

Maximum file size should be enforced.

Uploaded files should have generated storage names rather than trusting the
original filename.

---

# 63. SEO

Every public page should support:

- Metadata
- OpenGraph
- Twitter/X metadata
- Canonical URLs
- Sitemap
- robots.txt
- Structured data

Project pages:

```text
/projects/[slug]
```

should have dynamic metadata.

---

# 64. Performance

Target:

```text
Fast initial load
Minimal client JavaScript
Optimized images
Lazy-loaded project galleries
Server-rendered content where possible
```

Avoid making the entire application a Client Component.

Use Client Components only where interaction requires them.

---

# 65. Responsive Design

## Desktop

```text
12-column grid
```

## Tablet

```text
6-column grid
```

## Mobile

```text
1-column layout
```

---

# 66. Mobile Navigation

Desktop:

```text
VIDUN.DEV

BUILD
STACK
WORK
JOURNEY
SAY HI
```

Mobile:

```text
VIDUN.DEV                         ☰
```

Menu opens:

```text
┌─────────────────────────┐
│                         │
│ BUILD                   │
│                         │
│ STACK                   │
│                         │
│ WORK                    │
│                         │
│ JOURNEY                 │
│                         │
│ SAY HI                  │
│                         │
└─────────────────────────┘
```

Menu should animate using Framer Motion.

---

# 67. Accessibility

The design must support:

- Keyboard navigation
- Focus states
- Semantic HTML
- Accessible forms
- Screen readers
- Alt text
- Reduced motion
- Sufficient contrast

---

# 68. Reduced Motion

Respect:

```text
prefers-reduced-motion
```

When enabled:

```text
Disable floating animations
Disable parallax
Reduce transitions
Disable complex scroll animations
```

The site should remain completely usable without animation.

---

# 69. Animation Performance

Animations should primarily use:

```text
transform
opacity
scale
rotate
```

Avoid expensive layout animations where possible.

Use `will-change` only where justified.

Do not animate hundreds of DOM elements simultaneously.

---

# 70. Component Architecture

```text
components/
│
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
│
├── portfolio/
│   ├── navbar.tsx
│   ├── hero.tsx
│   ├── capability-card.tsx
│   ├── about-section.tsx
│   ├── skills-section.tsx
│   ├── project-card.tsx
│   ├── project-grid.tsx
│   ├── experience-timeline.tsx
│   ├── contact-section.tsx
│   └── footer.tsx
│
├── animation/
│   ├── reveal.tsx
│   ├── magnetic.tsx
│   ├── floating.tsx
│   └── page-transition.tsx
│
└── admin/
    ├── sidebar.tsx
    ├── dashboard-card.tsx
    ├── project-editor.tsx
    ├── skill-editor.tsx
    ├── experience-editor.tsx
    ├── media-manager.tsx
    └── message-viewer.tsx
```

---

# 71. Animation Component Strategy

Create reusable animation components.

Example:

```tsx
<Reveal>
    <ProjectCard />
</Reveal>
```

```tsx
<Floating>
    <DecorativeElement />
</Floating>
```

```tsx
<Magnetic>
    <Button />
</Magnetic>
```

This prevents animation logic from being duplicated throughout the project.

---

# 72. Animation Rules

Do:

```text
Reveal
Stagger
Hover
Scroll
Parallax
Micro-interactions
```

Don't:

```text
Animate everything
Constantly move content
Use huge transitions
Block scrolling
Create excessive loading screens
```

---

# 73. Project Architecture

Recommended high-level structure:

```text
app/
│
├── (public)/
│   ├── page.tsx
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx
│   └── ...
│
├── admin/
│   ├── login/
│   ├── dashboard/
│   ├── projects/
│   ├── skills/
│   ├── experience/
│   ├── about/
│   ├── media/
│   ├── messages/
│   ├── activity/
│   └── settings/
│
└── api/
```

---

# 74. Server Architecture

Preferred flow:

```text
UI
 ↓
Server Action / Route Handler
 ↓
Validation
 ↓
Authorization
 ↓
Database / Storage
 ↓
Result
 ↓
UI update
```

Never:

```text
UI
 ↓
Database
```

for privileged operations.

---

# 75. Data Flow

Public:

```text
Visitor
 ↓
Next.js
 ↓
Server
 ↓
Published Database Content
 ↓
Rendered Portfolio
```

Admin:

```text
Admin
 ↓
Authentication
 ↓
Authorization
 ↓
Server Action
 ↓
Zod Validation
 ↓
Database
 ↓
Revalidate
 ↓
Updated Portfolio
```

---

# 76. Cache / Revalidation

When admin updates content:

```text
Update Project
       ↓
Database
       ↓
Revalidate project
       ↓
Public site updates
```

This avoids requiring a complete deployment whenever content changes.

---

# 77. Admin Preview

Future feature:

```text
DRAFT
  ↓
PREVIEW
  ↓
PUBLISH
```

The admin should eventually be able to preview exactly what a project will
look like before publishing it.

---

# 78. Error Handling

Public:

```text
404
Something went missing.

[ BACK HOME ]
```

Admin:

```text
Something went wrong.

Request ID:
ABC123

[ TRY AGAIN ]
```

Never expose database errors or sensitive server information to users.

---

# 79. Loading States

Use skeletons where appropriate.

Example:

```text
┌──────────────────────┐
│ ███████████████      │
│                      │
│ █████████            │
│ █████████████        │
└──────────────────────┘
```

Avoid unnecessary full-page spinners.

---

# 80. Empty States

Example:

```text
NO PROJECTS YET.

The next one might be interesting.

[ CREATE PROJECT ]
```

Admin empty states should still use the neobrutalist design system.

---

# 81. Future Features

Not part of V1 implementation:

```text
Blog

Case Studies

GitHub Integration

GitHub Statistics

Visitor Analytics

Project View Counts

Newsletter

Resume Generator

Testimonials

Now Building...

Currently Learning...

Live Project Status

Draft Preview

Content Versioning

Scheduled Publishing
```

---

# 82. V1 Feature Scope

## Public

- [x] Home
- [x] Creative Hero
- [x] About
- [x] Skills
- [x] Projects
- [x] Project Details
- [x] Experience
- [x] Contact
- [x] Footer
- [x] Responsive layout
- [x] SEO
- [x] Smooth animations
- [x] Reduced motion support

## Admin

- [x] Login
- [x] Dashboard
- [x] Project CRUD
- [x] Skills CRUD
- [x] Experience CRUD
- [x] About editor
- [x] Media manager
- [x] Contact messages
- [x] Activity log
- [x] Site settings

## Backend

- [x] PostgreSQL
- [x] Supabase
- [x] Authentication
- [x] RLS
- [x] Storage
- [x] Validation
- [x] Server-side mutations
- [x] Error handling
- [x] Security controls

---

# 83. V1 Visual Summary

```text
╔════════════════════════════════════════════════════╗
║                                                    ║
║  VIDUN.DEV               BUILD STACK WORK SAY HI   ║
║                                                    ║
║                                                    ║
║  HI, I'M VIDUN.                                    ║
║                                                    ║
║  I BUILD                                           ║
║  SOFTWARE                                           ║
║  THAT WORKS.                                       ║
║                                                    ║
║  Software engineer building useful things          ║
║                                                    ║
║  [ EXPLORE MY WORK → ]                             ║
║                                                    ║
║                  ┌──────────────────────┐           ║
║                  │                      │           ║
║          </>     │     PROFILE         │    API    ║
║                  │     VISUAL          │           ║
║             git  │                      │     DB    ║
║                  └──────────────────────┘           ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  WHAT I BUILD                                      ║
║                                                    ║
║  ┌─────────────┐ ┌─────────────┐                   ║
║  │ FULL STACK   │ │ MOBILE      │                   ║
║  └─────────────┘ └─────────────┘                   ║
║                                                    ║
║  ┌─────────────┐ ┌─────────────┐                   ║
║  │ SYSTEMS     │ │ GAME DEV    │                   ║
║  └─────────────┘ └─────────────┘                   ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  WHO'S BEHIND THE CODE?                            ║
║                                                    ║
║  [ PROFILE ]       ABOUT ME                        ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  MY TOOLBOX                                       ║
║                                                    ║
║  [ TYPESCRIPT ] [ NEXT.JS ] [ REACT ]             ║
║  [ PYTHON ]    [ C++ ]     [ C# ]                ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  THINGS I'VE BUILT                                ║
║                                                    ║
║  ┌──────────────────────────────────────────────┐  ║
║  │              FEATURED PROJECT                │  ║
║  └──────────────────────────────────────────────┘  ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  THE JOURNEY                                      ║
║                                                    ║
║  2026 ───── IT JUNIOR EXECUTIVE                   ║
║   │                                                ║
║  2025 ───── IT INTERNSHIP                         ║
║   │                                                ║
║  2024 ───── SOFTWARE ENGINEERING                  ║
║                                                    ║
╠════════════════════════════════════════════════════╣
║                                                    ║
║  LET'S BUILD                                       ║
║  SOMETHING.                                       ║
║                                                    ║
║  [ NAME ]                                          ║
║  [ EMAIL ]                                         ║
║  [ MESSAGE ]                                       ║
║                                                    ║
║              [ SEND MESSAGE → ]                    ║
║                                                    ║
╚════════════════════════════════════════════════════╝
```

---

# 84. Final Design Goal

The portfolio should communicate within the first few seconds:

```text
THIS PERSON
        ↓
CAN BUILD SOFTWARE
        ↓
UNDERSTANDS DESIGN
        ↓
UNDERSTANDS ENGINEERING
        ↓
CARES ABOUT QUALITY
```

The portfolio itself should be one of the strongest projects in the portfolio.

It should demonstrate:

```text
UI/UX
  +
React
  +
Next.js
  +
TypeScript
  +
Database Design
  +
Authentication
  +
Security
  +
Storage
  +
API Design
  +
Animation
  +
Responsive Design
  +
Deployment
```

The key principle is:

> **The website should be visually memorable without sacrificing the engineering quality underneath it.**

---

# 85. V1 → V2 Refinement Process

V1 should establish:

```text
Design System
       ↓
Page Structure
       ↓
Animation System
       ↓
Database Architecture
       ↓
Admin Architecture
       ↓
Security Model
```

Before implementation, V2 should refine:

1. Exact homepage composition
2. Exact navigation behavior
3. Hero visual
4. Animation choreography
5. Project card layouts
6. Mobile layouts
7. Admin dashboard
8. Admin editor UX
9. Database schema
10. Authentication model
11. Component inventory
12. Folder architecture
13. Design tokens
14. Responsive breakpoints
15. Accessibility requirements

Only after those are locked should implementation begin.

---

# END — V1 DESIGN DOCUMENT
