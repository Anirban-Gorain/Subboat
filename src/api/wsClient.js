import { createClient } from "graphql-ws";

let wsClient = null;

export function initWsClient({ url, accessToken }) {
  if (wsClient) {
    try {
      wsClient.dispose();
    } catch {}
  }

  wsClient = createClient({
    url,
    lazy: true,
    connectionParams: async () => {
      const token = accessToken;
      return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    },
    retryAttempts: Infinity,
    retryWait: async (retries) =>
      new Promise((r) => setTimeout(r, Math.min(1000 * 2 ** retries, 15000))),
  });

  return wsClient;
}

export function getWsClient() {
  if (!wsClient) {
    throw new Error("wsClient not initialized. Call initWsClient(...) first.");
  }
  return wsClient;
}
