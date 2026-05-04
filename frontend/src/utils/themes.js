export const THEMES = {
  forest: {
    name: "Forest",
    primaryColor: "#1a3a1a",
    secondaryColor: "#2d5a2d",
    accentColor: "#7cb342",
    textColor: "#f5f5f5",
    bgGradient: "linear-gradient(135deg, #1a3a1a 0%, #2d5a2d 100%)",
    cardBg: "rgba(45, 90, 45, 0.7)",
    borderColor: "#7cb342",
    description: "Dark, earthy tones for nature lovers",
  },

  greece: {
    name: "Greece",
    primaryColor: "#ffffff",
    secondaryColor: "#e8f4f8",
    accentColor: "#0066cc",
    textColor: "#003366",
    bgGradient: "linear-gradient(135deg, #ffffff 0%, #e8f4f8 100%)",
    cardBg: "rgba(255, 255, 255, 0.9)",
    borderColor: "#0066cc",
    description: "Bright, clean whites and blues like the Mediterranean",
  },

  desert: {
    name: "Desert",
    primaryColor: "#8b6914",
    secondaryColor: "#d4a574",
    accentColor: "#e8a76a",
    textColor: "#fff9e6",
    bgGradient: "linear-gradient(135deg, #8b6914 0%, #d4a574 100%)",
    cardBg: "rgba(212, 165, 116, 0.8)",
    borderColor: "#e8a76a",
    description: "Warm, sandy tones for desert adventures",
  },

  ocean: {
    name: "Ocean",
    primaryColor: "#0a3d62",
    secondaryColor: "#1b6ca8",
    accentColor: "#48b8d4",
    textColor: "#e0f7ff",
    bgGradient: "linear-gradient(135deg, #0a3d62 0%, #1b6ca8 100%)",
    cardBg: "rgba(27, 108, 168, 0.7)",
    borderColor: "#48b8d4",
    description: "Deep ocean blues and teals",
  },

  mountain: {
    name: "Mountain",
    primaryColor: "#3a3a3a",
    secondaryColor: "#6b7280",
    accentColor: "#9ca3af",
    textColor: "#f3f4f6",
    bgGradient: "linear-gradient(135deg, #3a3a3a 0%, #6b7280 100%)",
    cardBg: "rgba(107, 114, 128, 0.7)",
    borderColor: "#9ca3af",
    description: "Cool grays and whites for mountain peaks",
  },

  urban: {
    name: "Urban",
    primaryColor: "#1f2937",
    secondaryColor: "#374151",
    accentColor: "#ef4444",
    textColor: "#f9fafb",
    bgGradient: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
    cardBg: "rgba(55, 65, 81, 0.8)",
    borderColor: "#ef4444",
    description: "Modern grays and blacks with red accents",
  },

  tropical: {
    name: "Tropical",
    primaryColor: "#1a4d2e",
    secondaryColor: "#2d8659",
    accentColor: "#d4145a",
    textColor: "#fff0f5",
    bgGradient: "linear-gradient(135deg, #1a4d2e 0%, #2d8659 100%)",
    cardBg: "rgba(45, 134, 89, 0.8)",
    borderColor: "#d4145a",
    description: "Vibrant greens and pinks for tropical vibes",
  },
}

export const getThemeStyles = (theme) => {
  const themeData = THEMES[theme] || THEMES.forest
  return themeData
}

export const getThemeClass = (theme) => {
  return `theme-${theme}`
}
