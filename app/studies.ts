export const studies = {
  pathways: {
    src: "/studio/pathways.webp",
    size: 1200,
    category: "01 / Perspective",
    title: "A clearer direction",
    alt: "TACTIC’s green and red marks become intersecting pathways with figures choosing a direction.",
    description:
      "Every decision opens a path. Our paired marks represent two perspectives: the possibility ahead and the lessons that help us get there. A visual exploration of clarity, choice, and moving with intent.",
  },
  strategy: {
    src: "/studio/strategy.webp",
    size: 1200,
    category: "02 / Strategy",
    title: "Thinking ahead",
    alt: "A chess pawn sits within a green ring among other pieces and TACTIC brand symbols.",
    description:
      "Creativity starts with a good question. This brand exploration brings the TACTIC perspective to the chessboard: see the bigger picture, understand the possibilities, and make the next move a considered one.",
  },
  architecture: {
    src: "/studio/architecture.webp",
    size: 900,
    category: "03 / Identity",
    title: "Built to stand apart",
    alt: "TACTIC’s opposing green and red marks form two architectural towers.",
    description:
      "An identity with substance. Our opposing forms become a small architectural world, turning a simple mark into a place for possibility. Distinctive from a distance. Considered up close.",
  },
};
export type Study = keyof typeof studies;
