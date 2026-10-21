export type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  /** Show the three empty box cells on the right of the strip. */
  cells?: boolean;
  /** Red "NOW" mark for a current role. No role uses it right now. */
  current?: boolean;
  /**
   * Resume bullets. The strip shows the first one.
   * TODO(open item 5): optional expanded view showing the remaining bullets.
   */
  impact: string[];
};

export const EXPERIENCES: Experience[] = [
  {
    company: "Hyperic",
    role: "Co-founder & CTO",
    start: "Dec 2025",
    end: "Jul 2026",
    impact: [
      "Raised ~$1M pre-seed (PearX, Pareto); Led a 7-engineer team building camera-only drone autonomy models",
      "Post-trained π0.5, a VLA model, with SFT and full-parameter GRPO against 3D Gaussian-splat scenes rebuilt from phone video - final distance to goal went from 3.02 m → 1.84 m (-39%) across 192 episodes",
      "Built the JAX → PyTorch/Triton weight-conversion bridge that made rollout inference fast enough to train against, plus an Optuna/ASHA sweep across a Modal H200/B200 fleet",
      "Developed BlueUAS-compliant digital video transmission system and STM32F7 avionics stack",
    ],
  },
  {
    company: "Solcoa",
    role: "Founding Engineer",
    start: "May 2025",
    end: "Aug 2025",
    impact: [
      "Employee #2 - Built the first thermochemical reactors to extract rare-earth metals (NdPr & Dy) from ore",
      "Built SCADA system for thermochemical reactors to remote supervise enabling 24/7 plant operations resulting in 3x yield output. Non-linear reactor models predicts temp and pressure runaways with 97% accuracy",
      "Engineered telemetry pipeline -ESP-32s, Postgres, and Grafana - logging 50,000+ points/day across live reactors",
      "Built a gradient-descent parameter-optimization model for refinement processes, improving yield quality 37%.",
    ],
  },
  {
    company: "Waterloo Aerial Robotics Group",
    role: "Fixed-Wing Team",
    start: "Mar 2025",
    end: "Nov 2025",
    cells: true,
    impact: [
      "Led the development of four modular 1.5m wingspan fixed-wing aircraft to validate our avionics and train pilots",
      "Built a fire detection and geo-tagging system using OpenCV for AEAC 2025. We placed first nationally.",
    ],
  },
  {
    company: "Waterloo Aerial Robotics Group",
    role: "Flight Test Coordinator",
    start: "Sep 2025",
    end: "Dec 2025",
    cells: true,
    impact: [
      "Planned flight test cards and safety checklists, executed safe flight tests with testing and flight line crew",
    ],
  },
];
