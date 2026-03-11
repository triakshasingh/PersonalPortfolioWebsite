/**
 * Skills for Standard Mode — premium categorized grid.
 * Edit here to update the skills section.
 */

export interface SkillCategory {
  label: string;
  items: string[];
}

export const skillsCategories: SkillCategory[] = [
  {
    label: "Languages",
    items: ["Python", "C++", "Java", "C", "JavaScript", "SQL"],
  },
  {
    label: "Quant / Data",
    items: [
      "NumPy",
      "pandas",
      "SciPy",
      "scikit-learn",
      "statsmodels",
    ],
  },
  {
    label: "Systems",
    items: [
      "Linux",
      "Git",
      "Multithreading",
      "Performance benchmarking",
    ],
  },
  {
    label: "Embedded",
    items: [
      "ESP32",
      "Raspberry Pi",
      "Arduino",
      "GPIO",
      "PWM",
      "UART",
      "I2C",
      "SPI",
      "Interrupts",
      "Hardware timers",
    ],
  },
  {
    label: "Backend",
    items: ["FastAPI", "Node.js", "MongoDB", "Socket.IO"],
  },
  {
    label: "Robotics",
    items: ["ROS2", "Betaflight"],
  },
];
