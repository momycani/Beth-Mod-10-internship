export function formatDuration(value: number | string | undefined): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "00:00";
    
    if (trimmed.includes(":")) return trimmed;
   
    const asNumber = Number(trimmed);
    if (!isNaN(asNumber)) {
      const totalSeconds = Math.max(0, Math.floor(asNumber));
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    return trimmed;
  }

  if (typeof value === "number" && !isNaN(value)) {
    const totalSeconds = Math.max(0, Math.floor(value));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return "00:00";
}