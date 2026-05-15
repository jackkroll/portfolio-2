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
  relevancyDate: Date;
};

export const projects: Project[] = [
  {
    slug: "labassistant",
    title: "Lab Assistant",
    kicker: "Modern Darkroom Timer",
    summary:
      "A refreshed take on darkroom timers that tracks and organizes each step",
    description: [
      "A passion of mine is film photography, and when I go to develop my film, I remember feeling very overwhelmed during the process with so many things to keep track of. I created Lab Assistant as a way to reduce the mental load that is keeping track of exact timings, while still keeping great accuracy",
      "Lab Assistant lets you keep the accuracy of using a timer, and get the benefits of step by step instructions that apps offer, while not having to worry about hastily setting timers through gloves during a time sensitive operation or losing accuracy while counting in your head."
    ],
    highlights: [
      "Create hands free workflows that automatically time everything",
      "Use tools to easily calculate dilution",
      "Track chemicals and see if they are expired",
      "Sync via iCloud to create on your phone, and use on a larger display when you need",
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
    relevancyDate: new Date("2026-03-07")
  },
  {
    slug: "hideandseek",
    title: "hide & seek",
    kicker: "make the world your playground",
    summary:
      "A multiplayer iOS game that expands hide and seek onto a larger scale, displaying a progressively shrinking search radius",
    description: [
      "This was an app I developed over the summer of 2025. It was heavily inspired by Jet Lag: The Game",
      "The seekers receive a randomized radius that the hider is somewhere within. This radius will shrink and randomly update every few minutes. The hider can see the precise locations of all hiders that updates a bit more frequently. The goal? Outmaneuver and outlast until the game is up."
    ],
    highlights: [
      "Powerful customization to play your way",
      "Precise seeker location view for the hider",
      "GameKit-powered multiplayer and achievements",
    ],
    assets: ["/hideandseek/1.png", "/hideandseek/2.png", "/hideandseek/3.png"],
    tech: ["GameKit", "Multipeer State Management", "View Routing"],
    links: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/us/app/hide-seek-play-anywhere/id6745705866",
        kind: "primary",
      },
    ],
    featured: false,
    relevancyDate: new Date("2025-08-06")
  },
  {
    slug: "maptimer",
    title: "Apex Legends Map Timer",
    kicker: "Widgets and live rotation data",
    summary:
      "A glanceable Apex Legends map rotation client with widgets, notifications, and a Swift server backend.",
    description: [
        "Apex Legends map rotation was at an interval that I found tough to mentally track, but I didn't want to visit a website each time I was even considering playing. The solution? Easily accessible widgets!",
      "Map Timer keeps Apex Legends players in the loop with easy-to-read widgets for the current map rotation.",
      "Users can set one-time notifications for favorite maps, while the app balances local schedule caching with live server validation.",
    ],
    highlights: [
      "WidgetKit views to stay up to date without ever opening the app",
      "One-time notifications for favorite maps",
      "Automatic updates via custom server",
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
    relevancyDate: new Date("2025-06-22")
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
        "Due to its age and established user base, I have no plans to significantly overhaul the backend or UI"
    ],
    highlights: [
      "Focused tallying experience with no ads or unnecessary features",
      "Haptics to confirm that each tally was recorded",
      "Small, fast, and intentionally uncomplicated",
    ],
    assets: ["/counter/1.png", "/counter/2.png", "/counter/3.png"],
    tech: ["SwiftUI", "iOS", "SwiftData"],
    links: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/us/app/counter-tallying-app/id1638375914",
        kind: "primary",
      },
    ],
    featured: false,
    relevancyDate: new Date("2026-01-15")
  },
  {
    slug: "liminal",
    title: "Liminal",
    kicker: "3D printer operations dashboard",
    summary:
      "A dashboard for managing OctoPrint and PrusaLink printers from one practical control surface.",
    description: [
        "My robotics team was dealing with having to quickly manage prints and submit them to different printers, and this workflow could easily be converted to a dashboard.",
      "Liminal connects users with multiple 3D printers through one dashboard. It interfaces with OctoPrint-based Prusa Mk3s printers and modern PrusaLink-based Mk4 printers."
    ],
    highlights: [
      "Manage OctoPrint and PrusaLink printers",
      "Manage accounts and many users",
      "PrintLater for delayed print workflows",
    ],
    assets: [],
    tech: ["OctoPrint", "PrusaLink","Python", "Flask"],
    links: [
      /*{
        label: "Read overview",
        href: "/projects/liminal/",
        kind: "primary",
      },*/
    ],
    featured: false,
    relevancyDate: new Date("2024-06-01")
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
      "Fully custom ISO controls",
      "Dimmable camera view for less intrusive metering",
      "Simple gesture-first interaction model",
    ],
    assets: [],
    tech: ["AVFoundation", "Film photography"],
    links: [
      {
        label: "Available on App Store",
        href: "https://apps.apple.com/us/app/minimal-light-meter/id6504420435",
        kind: "primary",
      },
    ],
    relevancyDate: new Date("2024-07-18")
  },
  {
    slug: "recall",
    title: "Recall",
    kicker: "Minimal flashcards",
    summary:
      "A flashcard study app exploring Apple Intelligence and Liquid Glass",
    description: [
      "Recall expands a traditional flashcard app with Apple Intelligence and a seek UX.",
    ],
    highlights: [
      "Apple Intelligence exploration for study workflows",
      "Model availability handling",
      "Modern Apple visual language and HIG practices",
    ],
    assets: ["/recall/1.png", "/recall/2.png", "/recall/3.png", "/recall/4.png",
      "/recall/5.png", "/recall/6.png", "/recall/7.png"],
    tech: ["SwiftUI", "Apple Intelligence", "Liquid Glass"],
    links: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/us/app/recall-minimal-flashcards/id6756734270",
        kind: "primary",
      },
    ],
    featured:true,
    relevancyDate: new Date("2026-01-10")
  },
  {
    slug: "alienstickers",
    title: "Cosmic Chaos: Alien Stickers",
    kicker: "Hand-drawn iMessage stickers",
    summary:
      "A collaborative hand-drawn sticker pack converted digitally without generative AI",
    description: [
      "Cosmic Chaos: Alien Stickers was a collaboration with a friend. The stickers were hand drawn, digitally converted, and released as an App Store sticker pack",
    ],
    highlights: [
      "Hand-drawn source artwork",
      "Digital sticker conversion workflow",
      "No generative AI used in the making",
    ],
    assets: [],
    tech: ["Illustration", "iMessage stickers"],
    links: [
      {
        label: "Download on App Store",
        href: "https://apps.apple.com/us/app/cosmic-chaos-alien-stickers/id6748267870",
        kind: "primary",
      },
    ],
    relevancyDate: new Date("2025-08-13")
  },
  {
    slug: "batteryshare",
    title: "BatteryShare",
    kicker: "Remote battery sync",
    summary:
      "An iCloud-based utility for checking a Mac's battery from an iPhone at a glance",
    description: [
        "My Mac's battery often lasted so long I never got into the habit of charging it each night, but then I would go to class and see it was nearly dead.",
        "BatteryShare syncs a Mac's charge level, charging state, and time remaining through iCloud so the latest status is available on an iPhone",
        "The Mac side runs as a lightweight menu bar app, while the iPhone side presents a clean dashboard with charging status and available estimates",
    ],
    highlights: [
      "Mac battery status visible from iPhone",
      "iCloud sync without extra accounts or third-party servers",
      "Menu bar helper with widgets on iOS",
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
    featured: true,
    relevancyDate: new Date("2026-04-30")
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export const projectCount = projects.length;

export const appStoreCount = projects.filter((project) =>
  project.links.some((link) => link.href.includes("apps.apple.com")),
).length;
