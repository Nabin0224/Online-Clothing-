// Returns a stable guestId stored in localStorage
export function getGuestId() {
  try {
    let id = localStorage.getItem("guestId");
    if (id && typeof id === "string" && id.length > 0) return id;
    // Prefer crypto.randomUUID when available
    const newId = (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("guestId", newId);
    return newId;
  } catch (_) {
    // Fallback without localStorage
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}


