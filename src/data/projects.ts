export type ProjectLink = {
  label: string;
  href: string;
  kind?: "primary" | "secondary";
};

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  description: string[];
  highlights: string[];
  assets?: string[];
  tech: string[];
  links: ProjectLink[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "labassistant",
    title: "Lab Assistant",
    kicker: "Modern Darkroom Timer",
    summary:
      "A refreshed take on darkroom timers that tracks and organizes each step. ",
    description: [
      "Lab Assistant was created to make film development feel calmer and more exact. It replaces mental counting, glove-unfriendly phone timers, and aging darkroom tools with guided workflows that run step by step.",
      "The app supports timed operations, agitation reminders, dilution tools, chemical tracking, expiration checks, and iCloud sync for moving between phone and larger displays.",
    ],
    highlights: [
      "Hands-free workflow timers with operation and agitation steps.",
      "Chemical tracking and dilution tools for development sessions.",
      "iCloud Sync",
    ],
    assets: ["/labassistant/1.png", "/labassistant/2.png", "/labassistant/3.png"],
    tech: ["SwiftUI", "iCloud"],
    links: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/us/app/lab-assistant-darkroom-timer/id6754861810",
        kind: "primary",
      },
    ],
    featured: true,
  },
  {
    slug: "hideandseek",
    title: "hide & seek",
    kicker: "Turn your city into a playground",
    summary:
      "A multiplayer iOS game that expands hide and seek onto a larger scale, displaying a progressively shrinking search radius",
    description: [
      "Built over summer 2025, hide & seek turns the world around a group into a playground. Seekers receive a randomized radius containing the hider; that radius shrinks and updates over time while the hider sees seeker locations more frequently.",
      "The project pushed deeper into custom navigation, multipeer state management, GameKit, and achievements.",
    ],
    highlights: [
      "Randomized seeker radius that updates throughout a match.",
      "Precise seeker location view for the hider.",
      "GameKit-powered multiplayer and achievements.",
    ],
    assets: ["/hideandseek/1.png", "/hideandseek/2.png", "/hideandseek/3.png"],
    tech: ["SwiftUI", "GameKit", "Multipeer state", "View Routing"],
    links: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/us/app/hide-seek-play-anywhere/id6745705866",
        kind: "primary",
      },
    ],
    featured: true,
  },
  {
    slug: "maptimer",
    title: "Apex Legends Map Timer",
    kicker: "Widgets and live rotation data",
    summary:
      "A glanceable Apex Legends map rotation client with widgets, notifications, and a Swift server backend.",
    description: [
      "Map Timer keeps Apex Legends players in the loop with easy-to-read widgets for the current map rotation.",
      "Users can set one-time notifications for favorite maps, while the app balances local schedule caching with live server validation.",
    ],
    highlights: [
      "WidgetKit views for home screen and lock screen map awareness.",
      "One-time notifications for favorite maps.",
      "Client and server data checks using hashes to keep schedules fresh.",
    ],
    assets: [],
    tech: ["WidgetKit", "Swift", "Vapor", "Cloudflare Tunnels"],
    links: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/us/app/map-timer/id6744300752",
        kind: "primary",
      },
      {
        label: "Technical writeup",
        href: "/projects/maptimer/technical/",
        kind: "secondary",
      },
    ],
    featured: false,
  },
  {
    slug: "counter",
    title: "Counter - Tallying App",
    kicker: "Focused utility",
    summary:
      "A dead-simple counting app built to count large quantities without ads, clutter, or friction.",
    description: [
      "Counter was the first app in my portfolio. It was designed as a straightforward tool: no ads, no distractions, just tap and keep count.",
      "A later iOS 26 update added new features and modernized navigation while staying faithful to the workflow longtime users already knew.",
    ],
    highlights: [
      "Focused tallying experience with no ads or unnecessary features.",
      "Modernized navigation while preserving familiar behavior.",
      "Small, fast, and intentionally uncomplicated.",
    ],
    assets: ["/counter/1.png", "/counter/2.png", "/counter/3.png"],
    tech: ["SwiftUI", "iOS", "Navigation"],
    links: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/us/app/counter-tallying-app/id1638375914",
        kind: "primary",
      },
    ],
    featured: false,
  },
  {
    slug: "liminal",
    title: "Liminal",
    kicker: "3D printer operations dashboard",
    summary:
      "A dashboard for managing OctoPrint and PrusaLink printers from one practical control surface.",
    description: [
      "Liminal connects users with multiple 3D printers through one dashboard. It interfaces with OctoPrint-based Prusa Mk3s printers and modern PrusaLink-based Mk4 printers.",
      "The surrounding writeups cover account design, configuration safety, first-time setup lessons, printer models, and delayed printing.",
    ],
    highlights: [
      "Dashboard for mixed OctoPrint and PrusaLink environments.",
      "Configuration and account protections documented in depth.",
      "PrintLater planning for delayed print workflows.",
    ],
    assets: [],
    tech: ["OctoPrint", "PrusaLink", "Configuration design", "Dashboard UX"],
    links: [
      {
        label: "Read overview",
        href: "/projects/liminal/",
        kind: "primary",
      },
    ],
    featured: false,
  },
  {
    slug: "lightmeter",
    title: "Minimal Light Meter",
    kicker: "Photography utility",
    summary:
      "A discreet light metering app with gesture controls, custom ISO, and a dimmable camera view.",
    description: [
      "Minimal Light Meter is designed to be quick, quiet, and easy to use while shooting film.",
      "It supports fully custom ISO values for unusual or expired film stocks and a dimmable camera view for discreet metering.",
    ],
    highlights: [
      "Fully custom ISO controls.",
      "Dimmable camera view for less intrusive metering.",
      "Simple gesture-first interaction model.",
    ],
    assets: [],
    tech: ["SwiftUI", "Camera", "Film photography"],
    links: [
      {
        label: "Available on App Store",
        href: "https://apps.apple.com/us/app/minimal-light-meter/id6504420435",
        kind: "primary",
      },
    ]
  },
  {
    slug: "recall",
    title: "Recall",
    kicker: "Minimal flashcards",
    summary:
      "A flashcard study app exploring Apple Intelligence integration and modern Apple interface patterns.",
    description: [
      "Recall expands a traditional flashcard app with Apple Intelligence. It started as a study-heavy class companion and grew into a broader exploration of model availability, Liquid Glass adoption, and HIG-aligned interface design.",
    ],
    highlights: [
      "Apple Intelligence exploration for study workflows.",
      "Model availability handling.",
      "Modern Apple visual language and HIG practice.",
    ],
    assets: ["/recall/1.png", "/recall/2.png", "/recall/3.png", "/recall/4.png",
      "/recall/5.png", "/recall/6.png", "/recall/7.png"],
    tech: ["SwiftUI", "Apple Intelligence", "Liquid Glass", "HIG"],
    links: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/us/app/recall-minimal-flashcards/id6756734270",
        kind: "primary",
      },
    ],
    featured:true
  },
  {
    slug: "alienstickers",
    title: "Cosmic Chaos: Alien Stickers",
    kicker: "Hand-drawn iMessage stickers",
    summary:
      "A collaborative hand-drawn sticker pack converted digitally without generative AI.",
    description: [
      "Cosmic Chaos: Alien Stickers was a collaboration with a friend. The stickers were hand drawn, digitally converted, and released as an App Store sticker pack.",
    ],
    highlights: [
      "Hand-drawn source artwork.",
      "Digital sticker conversion workflow.",
      "No generative AI used in the making.",
    ],
    assets: [],
    tech: ["Illustration", "iMessage stickers", "App Store"],
    links: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/us/app/cosmic-chaos-alien-stickers/id6748267870",
        kind: "primary",
      },
    ]
  },
  {
    slug: "batteryshare",
    title: "BatteryShare",
    kicker: "Remote battery sync",
    summary:
      "An iCloud-based utility for checking a Mac's battery from an iPhone at a glance.",
    description: [
      "BatteryShare syncs a Mac's charge level, charging state, and time remaining through iCloud so the latest status is available on an iPhone.",
      "The Mac side runs as a lightweight menu bar app, while the iPhone side presents a clean dashboard with charging status, estimates, last sync time, and stale-sync reminders.",
    ],
    highlights: [
      "Mac battery status visible from iPhone.",
      "iCloud sync without extra accounts or third-party servers.",
      "Menu bar helper with at-a-glance status on iOS.",
    ],
    assets: ["/batteryshare/1.png", "/batteryshare/2.png"],
    tech: ["SwiftUI", "iCloud", "macOS menu bar", "iOS"],
    links: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/us/app/batteryshare-remote-sync/id6759878234",
        kind: "primary",
      },
    ],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const projectCount = projects.length;

export const appStoreCount = projects.filter((project) =>
  project.links.some((link) => link.href.includes("apps.apple.com")),
).length;
