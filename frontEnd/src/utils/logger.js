// Simple logger utility
export const logInfo = (message, data = null) => {
  if (import.meta.env.VITE_ENV !== "production") {
    console.info("[INFO]:", message, data || "");
  }
  // In production, you can send logs to server or 3rd-party service
};

export const logWarn = (message, data = null) => {
  if (import.meta.env.VITE_ENV !== "production") {
    console.warn("[WARN]:", message, data || "");
  }
  // Production: send to monitoring service
};

export const logError = (error, context = "") => {
  if (import.meta.env.VITE_ENV !== "production") {
    console.error("[ERROR]:", context, error);
  }

  // Example: send to Sentry, LogRocket, or custom API
  if (import.meta.env.VITE_ENV === "production") {
    // sendErrorToMonitoringService(error, context)
  }
};
