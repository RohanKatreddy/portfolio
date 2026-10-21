export type Project = {
  title: string;
  /** null = year not confirmed yet (TODO open item 1); shown as "20XX" like the design. */
  year: string | null;
  /**
   * Drawing base name in /public/assets/projects. `<image>.png` is used in
   * light mode and `<image>Dark.png` in dark mode. null = no drawing yet.
   */
  image: string | null;
  /** Optional muted clip in /public, played over the drawing while the card is hovered. */
  video?: string;
  /** The "What?" line from Portfolio.pdf, verbatim. */
  description: string;
};

// TODO(open item 5): optional details view per project ("How?" / "Results?" from Portfolio.pdf).
export const PROJECTS: Project[] = [
  {
    title: "Natural Language Autonomous Drones",
    year: "2026", // TODO(open item 1): real year
    image: "quadcopter",
    // 640×360 cut of the autonaerospace.com home video.
    video: "/assets/projects/quadcopter.mp4",
    description:
      "Build drones capable of natural language instructions to increase accessibility and use cases across industrial industries.",
  },
  {
    title: "Modular Fixed-Wing Aircraft",
    year: "2025", // TODO(open item 1): real year
    image: "rcPlane",
    description: "Build a modular payload, high endurance aircraft for custom autopilot testing and ground mapping.",
  },
  {
    title: "Self Playing Guitar",
    year: "2025",
    image: "guitar",
    description: "Build a self playing guitar for HackCanada 2025 in 36hours",
  },
  {
    title: "Solar Powered LoRa Weather Station",
    year: "2023", // TODO(open item 1): real year
    image: "weatherStation",
    description: "Monitor weather and air quality in areas without power or connectivity infrastructure",
  },
  {
    title: "Waypoint Autonomous Car",
    year: "2024", // TODO(open item 1): real year
    image: "rcCar",
    description:
      "Build an autonomous car to be used for deliveries and as a stepping stone for future aerial autopilots",
  },
  {
    title: "InMoov Humanoid Robot",
    year: "2023", // TODO(open item 1): real year
    image: "inMoov",
    description:
      "Led the InMoov humanoid project as STEM Club lead, turning it into an end-to-end learning platform in 3D printing, electronics, and software.",
  },
  {
    title: "Flora Feed",
    year: "2018",
    // TODO(open item 2): add floraFeed.png / floraFeedDark.png and a fuller description.
    image: null,
    description: "Plant watering system.",
  },
];
