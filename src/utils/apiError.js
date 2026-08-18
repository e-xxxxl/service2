// utils/apiError.js
//
// A fetch() call that never gets a response (offline, DNS failure, CORS
// block, server unreachable) throws a raw TypeError whose message is
// whatever the browser happens to word it as - "Failed to fetch" in
// Chrome/Edge, "NetworkError when attempting to fetch resource" in
// Firefox, "Load failed" in Safari. None of that means anything to a user.
// This maps any such failure to one consistent, actionable message, while
// leaving real server-returned error messages (e.g. "Invalid password")
// untouched.
const NETWORK_ERROR_PATTERNS = [
  /failed to fetch/i,
  /networkerror/i,
  /load failed/i,
  /network request failed/i,
];

export function friendlyErrorMessage(err) {
  if (!err) return "Something went wrong. Please try again.";
  const message = err.message || String(err);
  if (err instanceof TypeError || NETWORK_ERROR_PATTERNS.some((p) => p.test(message))) {
    return "Network error. Please check your connection and try again.";
  }
  return message;
}
