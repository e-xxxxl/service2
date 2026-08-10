// hooks/useSocket.js
//
// One Socket.io connection per mounted dashboard, authenticated with the
// same JWT used for REST calls. The server already scopes each connection
// to a `user:<id>` room and a `conversation:<id>` room on join, so this
// hook just manages the connection lifecycle and exposes it - actual event
// handling lives in the components that need specific events.
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "https://service-server-e64r.onrender.com/api";
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

export function useSocket() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return undefined;

    const s = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });

    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("connect_error", () => setConnected(false));

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
      setConnected(false);
    };
  }, []);

  return { socket, connected };
}
