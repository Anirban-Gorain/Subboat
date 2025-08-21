import { useEffect, useRef, useState } from "react";
import { getWsClient } from "../api/wsClient";

export function useGraphQLSubscription({ query, variables, enabled = true }) {
  const clientRef = useRef(null);

  const [state, setState] = useState({
    loading: !!enabled,
    data: null,
    error: null,
  });

  useEffect(() => {
    if (!enabled) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    const client = getWsClient();
    clientRef.current = client;

    const dispose = client.subscribe(
      { query, variables },
      {
        next: (result) => {
          setState({
            loading: false,
            data: result.data.messages_messages,
            error: null,
          });

          console.log(result.data.messages_messages);
        },

        error: (err) => {
          const message = Array.isArray(err)
            ? err.map((e) => e.message).join(", ")
            : err.message ?? String(err);
          setState({ loading: false, data: null, error: message });
        },
        complete: () => {},
      }
    );

    return () => {
      try {
        dispose();
      } catch {}
    };
  }, [query, JSON.stringify(variables), enabled]);

  return state;
}
